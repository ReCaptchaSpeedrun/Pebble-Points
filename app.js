// 1) Your Firebase settings (replace with your own):
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
};

// 2) Initialize Firebase services:
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.getAuth(app);
const db = firebase.getFirestore(app);

// 3) Connect to the page elements:
const ptsDisplay = document.getElementById('points');
const addBtn = document.getElementById('add');
const useBtn = document.getElementById('use');
const alertBox = document.getElementById('alert');

// 4) Let Firebase sign in visitor anonymously:
firebase.signInAnonymously(auth)
  .catch(err => console.error(err));

// 5) When signed in, load current points:
auth.onAuthStateChanged(async user => {
  if (!user) return;
  const docRef = firebase.doc(db, 'userPoints', user.uid);
  const snap = await firebase.getDoc(docRef);
  const pts = snap.exists() ? snap.data().pts : 0;
  ptsDisplay.textContent = pts + ' points';
});

// 6) Function to change points:
async function changePoints(amount) {
  alertBox.textContent = '';
  const user = auth.currentUser;
  if (!user) return;
  const docRef = firebase.doc(db, 'userPoints', user.uid);
  try {
    await firebase.setDoc(
      docRef,
      { pts: firebase.increment(amount) },
      { merge: true }
    );
  } catch {
    alertBox.textContent = 'Error updating points';
  }
}

// 7) Button clicks:
addBtn.addEventListener('click', () => changePoints(10));
useBtn.addEventListener('click', () => changePoints(-50));
