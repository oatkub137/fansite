// 1. ตั้งค่าการเชื่อมต่อ Firebase (อัปเดต databaseURL ตามที่คุณส่งมา)
const firebaseConfig = {
  apiKey: "AIzaSyBsee_dvQy7s71K7T0BEAD9ZqzQXiKlAUo",
  authDomain: "fansite-loveyou.firebaseapp.com",
  projectId: "fansite-loveyou",
  storageBucket: "fansite-loveyou.firebasestorage.app",
  messagingSenderId: "259409320933",
  appId: "1:259409320933:web:5af20a961db86c3024ad0c",
  measurementId: "G-26K5JEJF3K",
  databaseURL: "https://fansite-loveyou-default-rtdb.asia-southeast1.firebasedatabase.app/" 
};

// 2. เริ่มต้นระบบ
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

// 3. โหลดข้อมูลจาก Firebase (ดึงข้อมูลมาแสดงผล)
database.ref('blogs').on('value', (snapshot) => {
    blogList.innerHTML = "";
    const data = snapshot.val();
    if (data) {
        const blogsArray = Object.values(data);
        // เรียงลำดับให้ของใหม่ไปอยู่ข้างบนปุ่มเพิ่ม (เรียงตามเวลาที่สร้าง)
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
    } else {
        blogList.innerHTML = "<p style='text-align:center; color:#888;'>ยังไม่มีความทรงจำใหม่ๆ เลย เพิ่มเลยสิ! ❤️</p>";
    }
});

// 4. บันทึกข้อมูลลง Firebase
document.getElementById("saveBtn").onclick = () => {
  const imageFile = document.getElementById("image").files[0];
  const text = document.getElementById("text").value;
  const date = document.getElementById("date").value;

  if (!imageFile || !text || !date) {
    alert("กรอกข้อมูลให้ครบก่อนนะ ❤️");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const newBlog = {
      image: e.target.result,
      text: text,
      date: date,
      createdAt: Date.now()
    };

    database.ref('blogs').push(newBlog)
        .then(() => {
            modal.style.display = "none";
            // ล้างค่าฟอร์ม
            document.getElementById("image").value = "";
            document.getElementById("text").value = "";
            document.getElementById("date").value = "";
        })
        .catch(err => alert("เกิดข้อผิดพลาด: " + err.message));
  };
  reader.readAsDataURL(imageFile);
};
