document.addEventListener('DOMContentLoaded', () => {
    // Sample user data retrieval function (modify this if your data is stored differently)
    function getPullHistory() {
        // Assuming the pull history is stored in localStorage with key 'pullHistory'
        const history = localStorage.getItem('pullHistory');
        return history ? JSON.parse(history) : [];
    }

    // Sample character data structure (for displaying images)
    const characterImages = {
        '3-star': 'path/to/3-star-image.png',
        '2-star': 'path/to/2-star-image.png',
        '1-star': 'path/to/1-star-image.png'
    };

    function displayPullHistory() {
        const historyContainer = document.getElementById('history');
        const pullHistory = getPullHistory();

        if (pullHistory.length === 0) {
            historyContainer.innerHTML = '<p>No pulls found. Start wishing to collect characters!</p>';
            return;
        }

        let starCounts = {
            '3-star': 0,
            '2-star': 0,
            '1-star': 0
        };

        // Create elements to display each character and count stars
        pullHistory.forEach(pull => {
            const { name, rarity } = pull;

            // Count the rarity
            if (rarity === '3-star') starCounts['3-star']++;
            else if (rarity === '2-star') starCounts['2-star']++;
            else if (rarity === '1-star') starCounts['1-star']++;

            // Create a div to display the character
            const charDiv = document.createElement('div');
            charDiv.classList.add('character-card');

            charDiv.innerHTML = `
                <img src="${characterImages[rarity]}" alt="${name}" class="character-image">
                <p>${name} - ${rarity}</p>
            `;

            historyContainer.appendChild(charDiv);
        });

        // Display summary of star counts
        const summaryDiv = document.createElement('div');
        summaryDiv.classList.add('star-summary');
        summaryDiv.innerHTML = `
            <h3>Summary</h3>
            <p>3-Star Characters: ${starCounts['3-star']}</p>
            <p>2-Star Characters: ${starCounts['2-star']}</p>
            <p>1-Star Characters: ${starCounts['1-star']}</p>
        `;
        historyContainer.prepend(summaryDiv);
    }

    // Call the function to display the history
    displayPullHistory();
});


