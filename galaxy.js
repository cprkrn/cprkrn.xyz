const canvas = document.getElementById('galaxy');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

// Star particles
class Star {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.z = Math.random() * 1500;
        this.size = Math.random() * 2;
        this.color = this.getStarColor();
    }

    getStarColor() {
        const colors = [
            'rgba(255, 255, 255,',
            'rgba(173, 216, 230,',
            'rgba(255, 192, 203,',
            'rgba(200, 200, 255,',
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.z -= 2;
        if (this.z <= 0) {
            this.reset();
            this.z = 1500;
        }
    }

    draw() {
        const x = (this.x - width / 2) * (1500 / this.z) + width / 2;
        const y = (this.y - height / 2) * (1500 / this.z) + height / 2;
        const size = (1 - this.z / 1500) * this.size * 3;
        const opacity = 1 - this.z / 1500;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = this.color + opacity + ')';
        ctx.fill();

        // Add glow for larger stars
        if (this.z < 500) {
            ctx.beginPath();
            ctx.arc(x, y, size * 2, 0, Math.PI * 2);
            ctx.fillStyle = this.color + (opacity * 0.2) + ')';
            ctx.fill();
        }
    }
}

// Nebula particles for added depth
class NebulaParticle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 150 + 50;
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.speedY = (Math.random() - 0.5) * 0.2;
        this.opacity = Math.random() * 0.03 + 0.01;
        this.color = this.getNebulaColor();
    }

    getNebulaColor() {
        const colors = [
            'rgba(138, 43, 226,',   // Purple
            'rgba(75, 0, 130,',      // Indigo
            'rgba(0, 100, 200,',     // Deep blue
            'rgba(200, 0, 100,',     // Deep pink
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < -this.size) this.x = width + this.size;
        if (this.x > width + this.size) this.x = -this.size;
        if (this.y < -this.size) this.y = height + this.size;
        if (this.y > height + this.size) this.y = -this.size;
    }

    draw() {
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, this.color + this.opacity + ')');
        gradient.addColorStop(1, this.color + '0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);
    }
}

// Create particles
const stars = Array.from({ length: 800 }, () => new Star());
const nebula = Array.from({ length: 8 }, () => new NebulaParticle());

// Animation loop
function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, width, height);

    // Draw nebula
    nebula.forEach(particle => {
        particle.update();
        particle.draw();
    });

    // Draw stars
    stars.forEach(star => {
        star.update();
        star.draw();
    });

    requestAnimationFrame(animate);
}

// Handle window resize
window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

// Start animation
animate();

