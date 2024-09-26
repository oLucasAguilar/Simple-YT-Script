function getPlaylistSettings(targetPlaylistName = null, currentPlaylistName = null, delay = null) {
	const targetPlaylist = targetPlaylistName || prompt("Enter the target playlist name (e.g., 'Unlisted Watch Later'):");
	const currentPlaylist = currentPlaylistName || prompt("Enter the current playlist name (e.g., 'Watch later'):");

	if (delay === null) {
		delay = parseInt(prompt("Enter the delay between processing videos in milliseconds (e.g., 1000 for 1 second):"), 10);
	}

	const selectCurrentPlaylist = confirm("Do you want to select the current playlist after the target one? (OK for Yes, Cancel for No)");

	return { targetPlaylist, currentPlaylist, delay, selectCurrentPlaylist };
}

const { targetPlaylist, currentPlaylist, delay, selectCurrentPlaylist } = getPlaylistSettings();

const videos = [];

function selectVideos() {
	const videoElements = document.querySelectorAll('ytd-playlist-video-renderer');
	console.log(`Found ${videoElements.length} videos`);

	if (videoElements.length > 0) {
		videos.push(...videoElements);
		processNextVideo(0);
	} else {
		console.log("No videos found.");
	}
}

function processNextVideo(index) {
	if (index < videos.length) {
		const video = videos[index];
		clickOptionsButton(video, index);
	} else {
		console.log("All videos processed.");
	}
}

function clickOptionsButton(video, index) {
	const optionsButton = video.querySelector('#button[aria-label="Action menu"]');

	if (optionsButton) {
		console.log("Options button found!");
		optionsButton.style.border = "2px solid red";

		optionsButton.click();
		console.log("Options button clicked!");

		setTimeout(() => openSaveToPlaylistDialog(index), delay);
	} else {
		console.log("Options button not found.");
		processNextVideo(index + 1);
	}
}

function openSaveToPlaylistDialog(index) {
	const saveToPlaylistButton = Array.from(document.querySelectorAll('tp-yt-paper-item')).find(item =>
		item.textContent.trim() === "Save to playlist"
	);

	if (saveToPlaylistButton) {
		saveToPlaylistButton.click();
		console.log("Opened Save to Playlist dialog!");

		setTimeout(() => selectTargetPlaylist(index), delay);
	} else {
		console.log("Save to Playlist button not found.");
		processNextVideo(index + 1);
	}
}

function selectTargetPlaylist(index) {
	const targetPlaylistCheckbox = Array.from(document.querySelectorAll('tp-yt-paper-checkbox')).find(checkbox =>
		checkbox.textContent.trim() === targetPlaylist
	);

	if (targetPlaylistCheckbox) {
		targetPlaylistCheckbox.click();
		console.log("Target playlist selected!");

		if (selectCurrentPlaylist) {
			setTimeout(() => selectCurrentWatchLater(index), delay);
		} else {
			console.log("Skipping selection of the current playlist.");
			setTimeout(() => closeSaveToPlaylistDialog(index), delay);
		}
	} else {
		console.log("Target playlist checkbox not found.");
		processNextVideo(index + 1);
	}
}

function selectCurrentWatchLater(index) {
	const currentWatchLaterCheckbox = Array.from(document.querySelectorAll('tp-yt-paper-checkbox')).find(checkbox =>
		checkbox.textContent.trim() === currentPlaylist
	);

	if (currentWatchLaterCheckbox) {
		currentWatchLaterCheckbox.click();
		console.log("Current Watch Later playlist selected!");

		setTimeout(() => closeSaveToPlaylistDialog(index), delay);
	} else {
		console.log("Current Watch Later checkbox not found.");
		processNextVideo(index + 1);
	}
}

function closeSaveToPlaylistDialog(index) {
	const closeButton = document.querySelector('yt-icon-button[aria-label="Close"]')
		|| Array.from(document.querySelectorAll('yt-icon-button')).find(button =>
			button.querySelector('svg') && button.querySelector('svg path')
		);

	if (closeButton) {
		closeButton.click();
		console.log("Closed Save to Playlist dialog!");

		setTimeout(() => processNextVideo(index + 1), delay);
	} else {
		console.log("Close button not found.");
		processNextVideo(index + 1);
	}
}

selectVideos();
