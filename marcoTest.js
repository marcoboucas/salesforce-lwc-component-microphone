import { LightningElement, track } from 'lwc';

const types = [
  'video/webm',
  'audio/webm',
  'audio/ogg;codecs=opus',
  'audio/mp4',
  'video/webm;codecs=vp8',
  'video/webm;codecs=daala',
  'video/webm;codecs=h264',
  'audio/webm;codecs=opus',
  'video/webm;codecs=vp8,opus',
  'video/mp4',
  'video/mpeg'
];

export default class MarcoTest extends LightningElement {
  currentStream = null;
  @track logs = [];
  get isListening() {
    return this.currentStream !== null;
  }
  status = 'none';
  get statusIcon() {
    switch (this.status) {
    case 'none':
      return '⬜️';
    case 'listening':
      return '✅';
    case 'error':
      return '❌';
    default:
      return '🟠';
    }
  }
  start() {
    try {
      this.status = 'starting';
      this.logs.push('Pushed the button start');
      this.logs.push('Navigator platform: ' + navigator.platform);
      this.logs.push(
        'Navigator mediadevices: ' +
          JSON.stringify(navigator.mediaDevices, null, 2)
      );
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        this.logs.push('Devices: ' + JSON.stringify(devices));
      });
      // eslint-disable-next-line @lwc/lwc/no-async-operation
      setTimeout(() => {
        for (const mimeType of types) {
          this.logs.push(
            'Trying to get the stream for ' +
              mimeType +
              ' support: ' +
              MediaRecorder.isTypeSupported(mimeType)
          );
        }
      }, 1000);

      navigator.mediaDevices
        .getUserMedia({ audio: true, video: false })
        .then((stream) => {
          this.logs.push('Starting the recording'); // WE NEVER REACH THIS LINE ON ANDROID
          this.stream = stream;

          // I want to display the stream in a video element
          // const video = this.template.querySelector('video');
          // video.srcObject = stream;
          // video.play();

          // const audio = this.template.querySelector('audio');
          // audio.srcObject = stream;
          // audio.play();
          this.logs.push('We should be live');
          this.status = 'listening';
        })
        .catch((err) => {
          this.status = 'error';
          this.logs.push('Error: ', JSON.stringify(err));
          this.logs.push(
            'err: ' + JSON.stringify(err, Object.getOwnPropertyNames(err), 2)
          );
          // How to make sure the error is displayed
          this.logs.push('err: ' + JSON.stringify(err?.message));
          this.logs.push('err: ' + JSON.stringify(err?.stack));

          this.logs.push();
        });
    } catch (err) {
      this.logs.push('Error global: ', JSON.stringify(err));
      this.logs.push(
        'error: ' + JSON.stringify(err, Object.getOwnPropertyNames(err), 2)
      );
      this.logs.push('err: ' + JSON.stringify(err.message));
      this.logs.push('err: ' + JSON.stringify(err.stack));
    }
  }

  end() {
    this.logs.push('Pushed the button end');
    console.log('Ending the recording');
    this.stream.getTracks().forEach((x) => {
      x.stop();
    });
  }

  get displayedLogs() {
    return this.logs.join('\n');
  }
}
