const socket = io('https://localhost:3000'); // Update with your server's URL

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('newProducer', async ({ producerId, kind }) => {
    const { id, iceParameters, iceCandidates, dtlsParameters } = await fetchTransportDetails();

    const transport = new mediasoupClient.WebRtcTransport({
        id,
        iceParameters,
        iceCandidates,
        dtlsParameters,
    });

    await transport.connect({ dtlsParameters });

    socket.emit('consume', {
        producerId,
        rtpCapabilities: transport.rtpCapabilities,a
    });

    socket.on('consumed', async ({ id, producerId, kind, rtpParameters }) => {
        const consumer = await transport.consume({ id, producerId, kind, rtpParameters });
        const videoElement = document.getElementById('remoteVideo');
        videoElement.srcObject = new MediaStream([consumer.track]);
    });
});

async function fetchTransportDetails() {
    return new Promise((resolve) => {
        socket.emit('transport', (details) => resolve(details));
    });
}
