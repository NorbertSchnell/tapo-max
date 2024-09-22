const tapo = require('tp-link-tapo-connect');
const minRequestInterval = 40;

class TapoBulb {
  constructor(deviceIndex, ipAddress, onError = () => { }) {
		this.deviceIndex = deviceIndex;
		this.ipAddress = ipAddress;
		
		this.device = null;
		this.ready = false;
		this.requestTime = 0;
		this.pendingIntensity = null;
		this.currentIntensity = null;
    this.timeout = null;
    this.onError = onError;

		this.setIntensity = this.setIntensity.bind(this);
	}

	async login(username, password) {
		this.device = await tapo.loginDeviceByIp(username, password, this.ipAddress);
		this.ready = true;
	}

	setIntensity(value) {
		const now = performance.now();

		value = Math.max(0, Math.min(100, value));
		this.pendingIntensity = value;

		if (this.ready && now >= this.requestTime + minRequestInterval && value !== this.currentIntensity) {
			this.ready = false;

			this.requestTime = performance.now();
			
			if (value > 0) {
				this.device.setBrightness(value)
					.then(() => {
						this.done(value);
					})
          .catch((err) => {
            this.onError(`${err} (setting device ${this.deviceIndex} to intensity ${value})`);
						this.done();
					});
			} else {
				this.device.turnOff(this.token)
					.then(() => {
						this.done(0);
					})
					.catch((err) => {
						this.onError(`${err} (device ${this.deviceIndex}, intensity: 0)`);
						this.done();
					});
			}
		}
	}

	done(value) {
		this.ready = true;

		if (value !== null) {
			this.currentIntensity = value;
		}

		if (this.timeout === null) {
			this.timeout = setTimeout(() => {
				this.timeout = null;
				this.setIntensity(this.pendingIntensity);
			}, 0);
		}
	}

	reset() {
		this.ready = true;
		this.pendingIntensity = null;
		this.currentIntensity = null;
	}

	async getInfo() {
		return this.device.getDeviceInfo();
	}
}

exports.TapoBulb = TapoBulb;
