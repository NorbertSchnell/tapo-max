const maxAPI = require('max-api');
const { TapoBulb } = require('./tapo-bulb.js');
const setup = require('./setup.js');

const bulbs = [];

/**
 * setup devices
 */
maxAPI.post("setup Tapo devices...");

for (let i = 0; i < setup.ipAddresses.length; i++) {
	const ipAddr = setup.ipAddresses[i];
	const bulb = new TapoBulb(i, ipAddr, maxAPI.post);

	bulb.login(setup.username, setup.password)
		.then(() => {
			maxAPI.post(`  ...connected to device ${i} (${ipAddr})`)
			bulbs[i] = bulb;
		})
		.catch((error) => {
			maxAPI.post(` ...cannot connect to device ${i} (${ipAddr}) - ${error}`)
			bulbs[i] = null;
		})
}

/**
 * Max message handlers
 */
maxAPI.addHandler("intensity", (index, value) => {
	const bulb = bulbs[index];

	if (bulb) {
		bulb.setIntensity(value);
	} else {
		maxAPI.post("invalid device index: " + index);
	}
});

maxAPI.addHandler("reset", (index) => {
	const bulb = bulbs[index];

	if (bulb) {
		bulb.reset();
	} else {
		maxAPI.post("invalid device index: " + index);
	}
});

maxAPI.addHandler("info", async (index, dictId) => {
	const bulb = bulbs[index];

	if (bulb) {
		const info = await bulb.getInfo();

		if (dictId) {
			maxAPI.setDict(dictId, info);
			maxAPI.outlet('info', index, 'dictionary', dictId);
		} else {
			maxAPI.post(`device ${index} info:`);
			maxAPI.post(info);
		}

	} else {
		maxAPI.post("invalid device index: " + index);
	}
});

maxAPI.addHandler("echo", (msg) => {
	maxAPI.outlet('echo', msg);
});
