// ข้อมูลที่คุณได้จาก Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyBsee_dvQy7s71K7T0BEAD9ZqzQXiKlAUo",
    authDomain: "fansite-loveyou.firebaseapp.com",
    projectId: "fansite-loveyou",
    storageBucket: "fansite-loveyou.firebasestorage.app",
    messagingSenderId: "259409320933",
    appId: "1:259409320933:web:5af20a961db86c3024ad0c",
    measurementId: "G-26K5JEJF3K",
    // บรรทัดนี้สำคัญมากสำหรับการใช้ Realtime Database
    databaseURL: "https://fansite-loveyou-default-rtdb.firebaseio.com" 
};

// เริ่มต้น Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const blogList = document.getElementById('blogList');
const modal = document.getElementById('uploadModal');
const openBtn = document.getElementById('openModalBtn');
const closeBtn = document.querySelector('.close-btn');

// เปิด-ปิด Pop-up
openBtn.onclick = () => modal.style.display = "block";
closeBtn.onclick = () => modal.style.display = "none";

// โหลดข้อมูลจาก Firebase แบบ Realtime
database.ref('posts').on('value', (snapshot) => {
    blogList.innerHTML = "";
    const data = snapshot.val();
    if (data) {
        const postsArray = Object.values(data);
        // เรียงจากเก่าไปใหม่ เพื่อให้ของใหม่ไปอยู่ล่างสุด (เหนือปุ่ม)
        postsArray.sort((a, b) => a.id - b.id);
        
        postsArray.forEach(post => {
            const card = document.createElement('div');
            card.className = 'blog-card';
            card.innerHTML = `
                <img src="${post.image}">
                <p>${post.text}</p>
                <small>📅 ${post.date}</small>
            `;
            blogList.appendChild(card);
        });
    }
});

// บันทึกข้อมูลลง Firebase
document.getElementById('saveBtn').onclick = () => {
    const imgFile = document.getElementById('imageInput').files[0];
    const text = document.getElementById('textInput').value;
    const date = document.getElementById('dateInput').value;

    if (!imgFile || !text || !date) return alert("กรอกข้อมูลให้ครบก่อนนะจ๊ะ ❤️");

    const reader = new FileReader();
    reader.onload = (e) => {
        database.ref('posts').push({
            id: Date.now(),
            image: e.target.result,
            text: text,
            date: date
        }).then(() => {
            modal.style.display = "none";
            // ล้างค่าในฟอร์ม
            document.getElementById('imageInput').value = "";
            document.getElementById('textInput').value = "";
            document.getElementById('dateInput').value = "";
        });
    };
    reader.readAsDataURL(imgFile);
};
