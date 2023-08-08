const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const videosFilePath = path.join(__dirname, "../data/videos.json");

const videos = require("../data/videos.json");
const { channel } = require("diagnostics_channel");

router.route("/").get((req, res) => {
	const filteredVideos = videos.map((video) => {
		const { id, title, channel, image } = video;
		return { id, title, channel, image };
	});

	res.json(filteredVideos);
});

router.route("/:id").get((req, res) => {
	const videoId = req.params.id;

	const foundVideo = videos.find((video) => video.id === videoId);

	if (foundVideo) {
		const {
			id,
			title,
			channel,
			image,
			description,
			views,
			likes,
			video,
			timestamp,
			comments,
		} = foundVideo;

		const videoData = {
			id,
			title,
			channel,
			image,
			description,
			views,
			likes,
			video,
			timestamp,
			comments: comments.map((comment) => ({
				id: comment.id,
				name: comment.name,
				comment: comment.comment,
				likes: comment.likes,
				timestamp: comment.timestamp,
			})),
		};

		res.json(videoData);
	} else {
		res.status(404).json({ error: "Video not found" });
	}
});

router.route("/").post((req, res) => {
	const { title, description, channel, image, video } = req.body;
	console.log("Received data:", req.body);

	const newVideoId = uuidv4();

	const newCommentId = uuidv4();

	const newComment = {
		id: newCommentId,
		name: "Maheshi",
		comment:
			"Wow, this video is absolutely captivating! The visuals are stunning, and the information presented is both informative and thought-provoking. I appreciate how well it's edited and how engaging the narration is. It kept me hooked from start to finish. Great job to everyone involved in creating this fantastic piece of content!",
		likes: 5,
		timestamp: Date.now(),
	};

	const newVideo = {
		id: newVideoId,
		title: title,
		channel: channel,
		image: image,
		description: description,
		views: "0",
		likes: "0",
		duration: "0:00",
		video: video,
		timestamp: Date.now(),
		comments: [newComment],
	};

	videos.push(newVideo);

	fs.writeFile(videosFilePath, JSON.stringify(videos), (err) => {
		if (err) {
			console.error("Error writing videos file:", err);
			res.status(500).json({ error: "Internal Server Error" });
		} else {
			res.status(201).json(newVideo);
		}
	});
});

module.exports = router;
