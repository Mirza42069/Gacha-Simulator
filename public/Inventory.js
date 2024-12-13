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
        // Function to display rarity counts and pull history

    const historyDiv = document.getElementById('history');

    // Retrieve pull history and rarity counts from localStorage
    const rarityCounts = JSON.parse(localStorage.getItem('raritycounts'));
    const totalPulls = localStorage.getItem('totalPulls');

    if (!rarityCounts || totalPulls === null) {
        historyDiv.innerHTML = '<p>No pull history found.</p>';
        return;
    }

    // Display total pulls
    const totalPullsDiv = document.createElement('div');
    totalPullsDiv.innerHTML = `<h3>Total Pulls: ${totalPulls}</h3>`;
    historyDiv.appendChild(totalPullsDiv);

    // Display rarity counts
    const raritySummaryDiv = document.createElement('div');
    raritySummaryDiv.innerHTML = '<h3>Pull Summary by Rarity:</h3>';
    Object.keys(rarityCounts).sort().forEach(rarity => {
        const rarityDiv = document.createElement('div');
        rarityDiv.textContent = `${rarity}★: ${rarityCounts[rarity]} `;
        raritySummaryDiv.appendChild(rarityDiv);
    });
    historyDiv.appendChild(raritySummaryDiv);


    // Call the function to display the history
    
});
