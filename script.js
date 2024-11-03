document.addEventListener('DOMContentLoaded', function () {
    const bullets = document.querySelectorAll('.bullet-navigation .bullet');
    const sections = document.querySelectorAll('section');

    const navbar = document.getElementById('navbar');

    const cards = document.querySelectorAll('.game-card');
    const indicators = document.querySelectorAll('.indicator');

    const letters = document.querySelectorAll('.jump-animation span'); // 获取所有字符

    const subTextElement = document.querySelector(".hero-content p");
    const subTexts = ["Crafting the Future of Gaming", "Innovating for Tomorrow", "Your Gateway to Immersive Worlds"];

    const links = document.querySelectorAll("nav ul li a");
    const underline = document.createElement("div");

    const activeLink = document.querySelector("nav ul li a.active");
    // Get the canvas and context
    const canvas = document.getElementById('starCanvas');
    const ctx = canvas.getContext('2d');

    const starIcon = new Image();

    let lastScrollTop = 0;
    let currentCard = 0;

    let delay = 0; // 延迟时间

    let subIndex = 0;
    let subTextCharIndex = 0;
    let isDeletingSubText = false;

    // Star and meteor arrays
    let stars = [];
    let meteors = [];
    
    function showCard(index) {
        cards.forEach(card => card.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));

        cards[index].classList.add('active');
        indicators[index].classList.add('active');
    }

    function nextCard() {
        currentCard = (currentCard + 1) % cards.length;
        showCard(currentCard);
    }

    indicators.forEach(indicator => {
        indicator.addEventListener('click', function () {
            currentCard = parseInt(this.getAttribute('data-index'));
            showCard(currentCard);
        });
    });

    showCard(currentCard);
    setInterval(nextCard, 6000);

    window.addEventListener('scroll', function () {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop) {
            // Scrolling down
            navbar.style.top = "-60px"; // Hide navbar
        } else {
            // Scrolling up
            navbar.style.top = "0"; // Show navbar
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
    });

    function updateActiveBullet() {
        let index = sections.length - 1;
        for (let i = 0; i < sections.length; i++) {
            const sectionTop = sections[i].offsetTop;
            const sectionHeight = sections[i].offsetHeight;
            if (window.scrollY + window.innerHeight / 2 >= sectionTop &&
                window.scrollY + window.innerHeight / 2 < sectionTop + sectionHeight) {
                index = i;
                break;
            }
        }
        bullets.forEach((bullet, i) => {
            bullet.classList.toggle('active', i === index);
        });
    }

    window.addEventListener('scroll', updateActiveBullet);
    updateActiveBullet();

    bullets.forEach((bullet, index) => {
        bullet.addEventListener('click', (e) => {
            e.preventDefault();
            sections[index].scrollIntoView({ behavior: 'smooth' });
        });
    });

    window.onload = function () {
        // Display the loading animation for 10 seconds
        setTimeout(function () {
            const loadingAnimation = document.getElementById('loading');
            if (loadingAnimation) {
                loadingAnimation.style.display = 'none';
            }
        }, 3000); // 10000 milliseconds = 10 seconds
    };

    letters.forEach((letter, index) => {
        setTimeout(() => {
            letter.classList.add('show'); // 添加 'show' 类以显示字符
        }, delay);
        delay += 300; // 每个字符之间的延迟（300ms）
    });

    function typeSubText() {
        const currentText = subTexts[subIndex];

        if (!isDeletingSubText) {
            // Typing phase
            if (subTextCharIndex < currentText.length) {
                subTextElement.textContent += currentText.charAt(subTextCharIndex);
                subTextCharIndex++;
                setTimeout(typeSubText, 200); // Control typing speed
            } else {
                // Pause after completing typing
                isDeletingSubText = true;
                setTimeout(typeSubText, 10000); // Wait before deleting
            }
        } else {
            // Deleting phase
            if (subTextCharIndex > 0) {
                subTextElement.textContent = currentText.substring(0, subTextCharIndex - 1);
                subTextCharIndex--;
                setTimeout(typeSubText, 100); // Control deleting speed
            } else {
                // Move to the next text and reset states
                isDeletingSubText = false;
                subIndex = (subIndex + 1) % subTexts.length; // Loop through texts
                setTimeout(typeSubText, 1000); // Wait before typing next text
            }
        }
    }

    subTextElement.textContent = ""; // Clear initial text
    typeSubText(); // Start the typing effect

    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Load star icon
    starIcon.src = 'data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="%23FFFFFF" d="M259.3 17.8L194 150.2 44.3 171.5c-26.8 3.8-37.4 36.6-18.1 55.2l110.7 107.5-26.1 151.7c-4.6 26.7 23.5 46.8 46.5 34.3L288 439.6l136.7 71.9c23 12.5 51.1-7.6 46.5-34.3l-26.1-151.7 110.7-107.5c19.3-18.6 8.7-51.4-18.1-55.2l-149.7-21.3-65.3-132.4c-12.4-25.1-47.8-25.1-60.2 0z"/></svg>';


    // Generate stars
    function generateStars(numStars) {
        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 15 + 5, // 5 to 20 size
                opacity: Math.random(),
                isHovered: false, // To check if the star is hovered
                isCaught: false // To check if the star is caught
            });
        }
    }

    // Draw stars
    function drawStars() {
        stars.forEach(star => {
            if (!star.isCaught) {
                ctx.globalAlpha = star.isHovered ? 1 : star.opacity; // Change opacity on hover
                ctx.fillStyle = star.isHovered ? 'yellow' : 'white'; // Change color on hover
                ctx.drawImage(starIcon, star.x, star.y, star.size, star.size); // Draw star icon
            }
        });
        ctx.globalAlpha = 1; // Reset alpha
    }

    // Generate meteors as stars
    function generateMeteors(numMeteors) {
        for (let i = 0; i < numMeteors; i++) {
            meteors.push({
                x: Math.random() * canvas.width, // Start at a random x position
                y: Math.random() * canvas.height, // Start at a random y position
                size: 30, // Size of the shooting star
                speed: Math.random() * 1 + 0.5, // Slower speed of the shooting star
                direction: Math.random() * Math.PI / 4 + Math.PI / 4 // Random angle between 45° and 90°
            });
        }
    }

    // Draw meteors as stars
    function drawMeteors() {
        meteors.forEach(meteor => {
            ctx.fillStyle = 'yellow'; // Set color for meteors
            ctx.drawImage(starIcon, meteor.x, meteor.y, meteor.size, meteor.size); // Draw shooting star icon

            // Move meteor diagonally
            meteor.x += meteor.speed * Math.cos(meteor.direction);
            meteor.y += meteor.speed * Math.sin(meteor.direction);

            // Reset meteor when it goes off the canvas
            if (meteor.x > canvas.width + 20 || meteor.y > canvas.height + 20) {
                meteors.splice(meteors.indexOf(meteor), 1); // Remove the meteor from the array
                generateMeteors(1); // Generate a new meteor
            }
        });
    }

    // Check if mouse is over a star
    function checkStarCaught(mouseX, mouseY) {
        stars.forEach(star => {
            const dist = Math.sqrt((star.x - mouseX) ** 2 + (star.y - mouseY) ** 2);
            if (dist < star.size) {
                star.isCaught = true; // Mark star as caught
            }
        });
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
        drawStars(); // Draw stars
        drawMeteors(); // Draw meteors (now stars)
        requestAnimationFrame(animate); // Keep the animation going
    }

    // Initialize stars and meteors
    generateStars(100); // Generate 100 stars
    generateMeteors(3); // Generate 3 meteors (now stars)
    animate(); // Start the animation

    // Handle mouse movement for star interaction
    canvas.addEventListener('mousemove', (event) => {
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        stars.forEach(star => {
            const dist = Math.sqrt((star.x - mouseX) ** 2 + (star.y - mouseY) ** 2);
            star.isHovered = dist < star.size; // Check if the mouse is near the star
        });
    });

    // Handle mouse click to catch stars
    canvas.addEventListener('click', (event) => {
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        checkStarCaught(mouseX, mouseY); // Check for caught stars
    });

    underline.classList.add("underline");
    document.querySelector("nav").appendChild(underline);

    // 更新下划线位置
    function updateUnderline(target) {
        underline.style.width = target.offsetWidth + "px"; // 设置下划线宽度为链接宽度
        underline.style.left = target.offsetLeft + "px"; // 设置下划线左侧位置
    }

    // 获取初始活动链接并设置下划线位置
    if (activeLink) {
        updateUnderline(activeLink);
    }

    // 处理点击事件
    links.forEach(link => {
        link.addEventListener("click", (e) => {
            // 移除其他链接的active类
            links.forEach(link => link.classList.remove("active"));
            e.currentTarget.classList.add("active");
            updateUnderline(e.currentTarget); // 更新下划线位置
        });
    });

    // 处理滚动事件以更新活动链接
    window.addEventListener("scroll", () => {
        let scrollPos = window.scrollY;
        links.forEach(link => {
            let section = document.querySelector(link.getAttribute("href"));
            if (section.offsetTop <= scrollPos && section.offsetTop + section.offsetHeight > scrollPos) {
                links.forEach(link => link.classList.remove("active"));
                link.classList.add("active");
                updateUnderline(link);
            }
        });
    });
});



