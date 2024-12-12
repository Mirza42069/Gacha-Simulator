document.addEventListener('DOMContentLoaded', () => {
    const username = sessionStorage.getItem('username');
    // Fetch pull history from the server
    async function getPullHistory(username) {
        try {
            const response = await fetch(`/pull-history/${username}`);
            if (!response.ok) {
                throw new Error('Failed to fetch pull history');
            }
            const data = await response.json();
            return data.pullHistory;  // Assuming the server returns pullHistory in the response body
        } catch (error) {
            console.error('Error fetching pull history:', error);
            return [];
        }
    }

    // Character images based on rarity
    const characterImages = {
        'Yoru' : 'images/yoru.jpg',
        'Hard' : 'images/hard image.jpg',
        'Skelly' : 'images/skelly.png',

        'MAGE X' : 'images/mage x.png',
        'Home Page' : 'images/front page chrome.png',
        'Tablet' : 'images/samsung tab.png',

        'STNK Vitram' : 'images/stnk.png',
        'Motor' : 'images/motor ilang.png',
        'Gelas Kopi' : 'images/bekas kopi (1).png'
}

    async function displayPullHistory() {
        if (!username) {
            console.log('No user is logged in');
            return;
        }

        const pullHistory = await getPullHistory(username);

        const historyContainer = document.getElementById('history');
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
            <p>3★: ${starCounts['3-star']}</p>
            <p>2★: ${starCounts['2-star']}</p>
            <p>1★: ${starCounts['1-star']}</p>
        `;
        historyContainer.prepend(summaryDiv);
    }

    // Call the function to display the history
    displayPullHistory();
});
