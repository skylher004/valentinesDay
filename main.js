onload = () => {
    const c = setTimeout(() => {
      document.body.classList.remove("not-loaded");
      clearTimeout(c);
    }, 1000);
  };

  const folderPath = 'picture/';
        let allImages = [];
        let shuffleInterval = null;

        async function init() {
            // Fade in header shortly after page load
            setTimeout(() => { document.getElementById('header').style.opacity = '1'; }, 500);

            try {
                const response = await fetch(folderPath);
                const text = await response.text();
                const regex = /href="([^"]*\.(?i:jpg|png|jpeg|webp))"/g;
                let matches = [];
                let match;
                while ((match = regex.exec(text)) !== null) {
                    if (match[1] !== 'default.jpg') matches.push(match[1]);
                }
                allImages = matches;
            } catch (err) { console.warn("Local server needed."); }

            // Wait 5 seconds, then show cards one by one
            setTimeout(showCardsOneByOne, 5000);
        }

        function showCardsOneByOne() {
            const cards = document.querySelectorAll('.card');
            const cardImgs = document.querySelectorAll('.card img');
            const initialSet = allImages.length >= 3 ? [...allImages].sort(() => 0.5 - Math.random()).slice(0, 3) : null;

            cards.forEach((card, i) => {
                setTimeout(() => {
                    if (initialSet) cardImgs[i].src = folderPath + initialSet[i];
                    card.classList.add('active');
                    
                    if (i === cards.length - 1) {
                        setTimeout(() => {
                            document.getElementById('controls').classList.add('visible');
                            if (allImages.length >= 3) startAutoShuffle();
                        }, 1000);
                    }
                }, i * 600); 
            });
        }

        function startAutoShuffle() {
            if (shuffleInterval) clearInterval(shuffleInterval);
            shuffleInterval = setInterval(triggerShuffle, 5000);
        }

        function handleManualShuffle() {
            triggerShuffle();
            startAutoShuffle();
        }

        function triggerShuffle() {
            if (allImages.length < 3) return;
            const cards = document.querySelectorAll('.card');
            const cardImgs = document.querySelectorAll('.card img');
            const selected = [...allImages].sort(() => 0.5 - Math.random()).slice(0, 3);

            cards.forEach((card, i) => {
                if (i !== 1) card.classList.add('shuffling');
                setTimeout(() => {
                    cardImgs[i].src = folderPath + selected[i];
                    setTimeout(() => card.classList.remove('shuffling'), 50); 
                }, 400); 
            });
        }

        window.onload = init;