const videoInput = document.getElementById("videoInput");
const uploadButton = document.getElementById("uploadButton");
const progressContainer = document.getElementById("progressContainer");
const progressBar = document.getElementById("progressBar");
//const fileList = document.getElementById("fileList");
const player = document.getElementById("player");
const uploadedFileName = document.getElementById("uploadedFileName");
const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");
const audioTracks = document.getElementById("audioTracks");
const subtitles = document.getElementById("subtitles");

// Subir archivo con barra de progreso
const uploadFile = async () => {
    const file = videoInput.files[0];
    if (!file) {
        alert("Selecciona un archivo para subir.");
        return;
    }

    const formData = new FormData();
    formData.append("video", file);

    progressContainer.style.display = "block";

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/videos/upload", true);

    xhr.upload.onprogress = (event) => {
        const percent = Math.round((event.loaded / event.total) * 100);
        progressBar.style.width = percent + "%";
    };

    xhr.onload = () => {
        progressContainer.style.display = "none";
        if (xhr.status === 200) {
            const { filename } = JSON.parse(xhr.responseText);
            //loadFileList();
            playFile(filename);
            resetProgressBar();
            showSuccessModal();
        } else {
            alert("Error al subir el archivo.");
        }
    };

    xhr.send(formData);
};

const resetProgressBar = () => {
    progressBar.style.width = "0%";
};

// const loadFileList = async () => {
//     const response = await fetch('/files');
//     if (response.ok) {
//         const files = await response.json();
//         fileList.innerHTML = '';
//         files.forEach((file) => {
//             const li = document.createElement('li');
//             li.innerHTML = `<a href="#" onclick="playFile('${file}')">${file}</a>`;
//             fileList.appendChild(li);
//         });
//     }
// };

const playFile = async (filename) => {
    player.src = `/videos/stream?filename=${filename}`;
    player.load();
    await loadMediaInfo(filename);
    player.play();
};

const loadMediaInfo = async (filename) => {
    const response = await fetch(`/videos/mediaInfo?filename=${filename}`);
    if (response.ok) {
        const mediaInfo = await response.json();

        audioTracks.innerHTML =
            '<option value="">Seleccionar pista de audio</option>';
        mediaInfo.audioTracks.forEach((track, index) => {
            const option = document.createElement("option");
            option.value = index;
            option.textContent = track.language || `Pista ${index + 1}`;
            audioTracks.appendChild(option);
        });

        subtitles.innerHTML = '<option value="">Seleccionar subtítulo</option>';
        mediaInfo.subtitles.forEach((subtitle, index) => {
            const option = document.createElement("option");
            option.value = index;
            option.textContent = subtitle.language || `Subtítulo ${index + 1}`;
            subtitles.appendChild(option);
        });
    }
};

audioTracks.addEventListener("change", () => {
    const selectedTrack = audioTracks.value;
    if (selectedTrack !== "") {
        player.audioTracks[selectedTrack].enabled = true;
    }
});

subtitles.addEventListener("change", () => {
    const selectedSubtitle = subtitles.value;
    if (selectedSubtitle !== "") {
        player.textTracks[selectedSubtitle].mode = "showing";
    }
});

uploadButton.addEventListener("click", uploadFile);
//window.onload = loadFileList;
