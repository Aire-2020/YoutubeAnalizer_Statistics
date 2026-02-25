const { google } = require("googleapis");
const fs = require("fs");

const API_KEY = "AIzaSyAP1_yYCBMsCxNPNDHUYIBdc1s_who-u-g";
const CHANNEL_ID = "UCnkEhPBMZcEO0QGu51fDFDg";

const youtube = google.youtube({
  version: "v3",
  auth: API_KEY,
});

// Number of videos to analyze
const videosToAnalyze = 100;

// Minimum duration in seconds (e.g., 180 = 3 minutes)
const minDuration = 60;

// Convert ISO 8601 (PT49M31S) to seconds
function durationToSeconds(isoDuration) {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = isoDuration.match(regex);

  const hours = matches[1] ? parseInt(matches[1]) : 0;
  const minutes = matches[2] ? parseInt(matches[2]) : 0;
  const seconds = matches[3] ? parseInt(matches[3]) : 0;

  return hours * 3600 + minutes * 60 + seconds;
}

async function getVideoStats() {
  try {
    // Delete previous file if it exists
    if (fs.existsSync("statistics.json")) {
      fs.unlinkSync("statistics.json");
    }

    // 1. Get channel uploads playlist
    const channelRes = await youtube.channels.list({
      part: "contentDetails",
      id: CHANNEL_ID,
    });

    const uploadsPlaylistId =
      channelRes.data.items[0].contentDetails.relatedPlaylists.uploads;

    let collectedVideos = [];
    let nextPageToken = null;

    // 2. Read playlist until collecting enough valid videos
    while (collectedVideos.length < videosToAnalyze) {
      const playlistRes = await youtube.playlistItems.list({
        part: "snippet",
        playlistId: uploadsPlaylistId,
        maxResults: 50,
        pageToken: nextPageToken,
      });

      const videoIds = playlistRes.data.items.map(
        item => item.snippet.resourceId.videoId
      );

      const statsRes = await youtube.videos.list({
        part: "statistics,snippet,contentDetails",
        id: videoIds.join(","),
      });

      const filtered = statsRes.data.items
        .filter(video =>
          durationToSeconds(video.contentDetails.duration) >= minDuration
        )
        .map(video => ({
          title: video.snippet.title,
          publishedAt: video.snippet.publishedAt,
          views: parseInt(video.statistics.viewCount || 0),
          likes: parseInt(video.statistics.likeCount || 0),
          comments: parseInt(video.statistics.commentCount || 0),
          durationSeconds: durationToSeconds(video.contentDetails.duration),
        }));

      collectedVideos.push(...filtered);

      nextPageToken = playlistRes.data.nextPageToken;

      if (!nextPageToken) break;
    }

    const finalVideos = collectedVideos.slice(0, videosToAnalyze);

    fs.writeFileSync(
      "statistics.json",
      JSON.stringify(finalVideos, null, 2),
      "utf-8"
    );

    console.log(`Data saved to statistics.json (${finalVideos.length} videos)`);

  } catch (error) {
    console.error("Error:", error.message);
  }
}

getVideoStats();