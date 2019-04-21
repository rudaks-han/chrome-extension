class FirebaseApp
{
	firebase;

	worktime_checker = "worktime_checker";
	user_config = "user_config";

	init()
	{
		const config = {
			apiKey: "AIzaSyBeWHyVqAAk-kXXPtsEg-4IK66P9Xjma4A",
			authDomain: "spectra-groupware.firebaseapp.com",
			databaseURL: "https://spectra-groupware.firebaseio.com",
			projectId: "spectra-groupware",
			storageBucket: "spectra-groupware.appspot.com",
			messagingSenderId: "785900078227"
		};
		this.firebase = firebase.initializeApp(config);
	}

	//writeLog(date, user, key, value)
	set(key, value)
	{
		logger.debug('firebase set');
		logger.debug('key: ' + key);
		logger.debug('value: ' + value);

		this.firebase.database().ref(key).set({
			value
		});
	}

	get(key, callback)
	{
		var ref = this.firebase.database().ref(key);
		ref.on('value', function(snapshot) {
			callback(snapshot);
		});
	}
}

const firebaseApp = new FirebaseApp();
firebaseApp.init();
