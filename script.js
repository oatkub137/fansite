// ตั้งค่า Firebase ด้วยข้อมูลของคุณ
const firebaseConfig = {
    apiKey: "AIzaSyBsee_dvQy7s71K7T0BEAD9ZqzQXiKlAUo",
    authDomain: "fansite-loveyou.firebaseapp.com",
    projectId: "fansite-loveyou",
    storageBucket: "fansite-loveyou.firebasestorage.app",
    messagingSenderId: "259409320933",
    appId: "1:259409320933:web:5af20a961db86c3024ad0c",
    measurementId: "G-26K5JEJF3K",
    // ลิงก์ฐานข้อมูลโซนเอเชียที่คุณสร้าง
    databaseURL: "https://fansite-loveyou-default-rtdb.asia-southeast1.firebasedatabase.app/" 
};

// เริ่มต้น Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const modal = document.getElementById("uploadModal");
const openBtn = document.getElementById("openModalBtn");
const closeBtn = document.getElementById("closeModalBtn");
const blogList = document.getElementById("blogList");

// ฟังก์ชัน เปิด/ปิด Modal
openBtn.onclick = () => modal.style.display = "block";
closeBtn.onclick = () => modal.style.display = "none";
window.onclick = (event) => {
  if (event.target == modal) modal.style.display = "none";
};

// ดึงข้อมูลมาแสดงผลแบบ Realtime
database.ref('blogs').on('value', (snapshot) => {
    blogList.innerHTML = "";
    const data = snapshot.val();
    if (data) {
        const blogsArray = Object.values(data);
        // เรียงจากเก่าไปใหม่ เพื่อให้ของใหม่สุดอยู่ล่างสุดแต่เหนือปุ่ม
        blogsArray.sort((a, b) => a.createdAt - b.createdAt);
        
        blogsArray.forEach(b => {
            const card = document.createElement('div');
            card.className = 'blog-card';
            card.innerHTML = `
                <img src="${b.image}">
                <p>${b.text}</p>
                <div class="date">📅 ${b.date}</div>
            `;
            blogList.appendChild(card);
        });
    }
});

// บันทึกข้อมูล
document.getElementById("saveBtn").onclick = () => {
  const imageInput = document.getElementById("imageInput");
  const textInput = document.getElementById("textInput");
  const dateInput = document.getElementById("dateInput");

  if (!imageInput.files[0] || !textInput.value || !dateInput.value) {
    alert("กรอกข้อมูลให้ครบก่อนนะ ❤️");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const newBlog = {
      image: e.target.result,
      text: textInput.value,
      date: dateInput.value,
      createdAt: Date.now()
    };

    database.ref('blogs').push(newBlog)
        .then(() => {
            modal.style.display = "none";
            // ล้างค่าฟอร์ม
            imageInput.value = "";
            textInput.value = "";
            dateInput.value = "";
        })
        .catch(err => alert("บันทึกไม่ได้: " + err.message));
  };
  reader.readAsDataURL(imageInput.files[0]);
};
