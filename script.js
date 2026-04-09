// 1. ตั้งค่า Firebase Configuration
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

// 2. เริ่มต้น Firebase
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

// 3. ดึงข้อมูลมาแสดงผล (Realtime) พร้อมปุ่มลบ
database.ref('blogs').on('value', (snapshot) => {
    blogList.innerHTML = "";
    const data = snapshot.val();
    if (data) {
        // ดึง Key ออกมาเพื่อให้ลบได้ถูกตำแหน่ง
        const blogsArray = Object.keys(data).map(key => ({
            key: key, 
            ...data[key]
        }));

        // เรียงลำดับจากเก่าไปใหม่ (เพื่อให้ของใหม่เพิ่มต่อท้ายแต่อยู่เหนือปุ่ม)
        blogsArray.sort((a, b) => a.createdAt - b.createdAt);
        
        blogsArray.forEach(b => {
            const card = document.createElement('div');
            card.className = 'blog-card';
            card.style.position = 'relative'; // เพื่อให้ปุ่มลบวางชิดมุมได้
            card.innerHTML = `
                <button onclick="deletePost('${b.key}')" class="delete-btn">🗑️</button>
                <img src="${b.image}">
                <p>${b.text}</p>
                <small class="date">📅 ${b.date}</small>
            `;
            blogList.appendChild(card);
        });
    }
});

// 4. ฟังก์ชันสำหรับลบข้อมูล
function deletePost(key) {
    if (confirm("จะลบความทรงจำนี้จริงๆ หรอ? 🥺")) {
        database.ref('blogs/' + key).remove()
            .then(() => {
                console.log("ลบสำเร็จ");
            })
            .catch((err) => {
                alert("ลบไม่ได้: " + err.message);
            });
    }
}

// 5. บันทึกข้อมูลใหม่
document.getElementById("saveBtn").onclick = () => {
  const imageInput = document.getElementById("imageInput");
  const textInput = document.getElementById("textInput");
  const dateInput = document.getElementById("dateInput");

  if (!imageInput.files[0] || !textInput.value || !dateInput.value) {
    alert("ใส่ข้อมูลให้ครบก่อนนะ ❤️");
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

    database.ref('blogs').push(newBlog).then(() => {
        modal.style.display = "none";
        imageInput.value = "";
        textInput.value = "";
        dateInput.value = "";
    });
  };
  reader.readAsDataURL(imageInput.files[0]);
};
