const socket = io('https://localhost:3000'); // Update with your server's URL

let transport;
let producer;
const videoElement = document.getElementById('videoElement');
const startSharingButton = document.getElementById('startSharing');

startSharingButton.addEventListener('click', async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    videoElement.srcObject = stream;

    const { id, iceParameters, iceCandidates, dtlsParameters } = await fetchTransportDetails();

    transport = new mediasoupClient.WebRtcTransport({
        id,
        iceParameters,
        iceCandidates,
        dtlsParameters,
    });

    await transport.connect({ dtlsParameters });

    producer = await transport.produce({ track: stream.getVideoTracks()[0] });
    socket.emit('produce', { kind: 'video', rtpParameters: producer.rtpParameters });

    startSharingButton.style.display = 'none';
    stopSharingButton.style.display = 'block';
});

async function fetchTransportDetails() {
    return new Promise((resolve) => {
        socket.emit('transport', (details) => resolve(details));
    });
}
