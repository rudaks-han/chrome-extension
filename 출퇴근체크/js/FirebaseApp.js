class FirebaseApp
{
	init()
	{
		var config = {
			apiKey: "AIzaSyBeWHyVqAAk-kXXPtsEg-4IK66P9Xjma4A",
			authDomain: "spectra-groupware.firebaseapp.com",
			databaseURL: "https://spectra-groupware.firebaseio.com",
			projectId: "spectra-groupware",
			storageBucket: "spectra-groupware.appspot.com",
			messagingSenderId: "785900078227"
		};
		const app = firebase.initializeApp(config);
	}

	writeLog(date, user, key, value)
	{
		firebase.database().ref('worktime_checker/' + date + '/' + user + '/' + key).set({
			value
		});
	}
}

const firebaseApp = new FirebaseApp();
firebaseApp.init();