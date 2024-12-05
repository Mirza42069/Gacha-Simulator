const togglebtn = document.getElementById('toggle-btn')
const sidebar = document.getElementById('sidebar')

function toggleSidebar(){
	sidebar.classList.toggle('close');
	togglebtn.classList.toggle('rotate');
}

// Ripple button functions
function setupRippleAnimation(container) {
	const ripples = container.querySelectorAll('.ripple');
	let currentRipple = 0;
	let animationInterval;

	function startRippleAnimation() {
		if (!container.parentElement.classList.contains('disabled')) {
			ripples[currentRipple].classList.remove('animate');
			void ripples[currentRipple].offsetWidth; // Force reflow
			ripples[currentRipple].classList.add('animate');
			currentRipple = (currentRipple + 1) % ripples.length;
		}
	}

	function startInterval() {
		// Initial ripple
		startRippleAnimation();
		// Set up interval for subsequent ripples
		animationInterval = setInterval(startRippleAnimation, 900);
	}

	function stopInterval() {
		clearInterval(animationInterval);
		// Let current animations finish
		ripples.forEach(ripple => {
			if (ripple.classList.contains('animate')) {
				ripple.addEventListener('animationend', () => {
					ripple.classList.remove('animate');
				}, { once: true });
			} else {
				ripple.classList.remove('animate');
			}
		});
	}

	startInterval();
	return { startInterval, stopInterval };
}

const toggleButton = document.getElementById('toggleButton');
const toggleRipples = document.getElementById('toggleRipples');
const toggleAnimations = setupRippleAnimation(toggleRipples);
let isDisabled = false;

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

// Function to show the image for the pulled character
function showCharacterImage(character) {
    const imageURL = characterImages[character]; // Get the image URL for the pulled character
    
    if (imageURL) {
        const imageElement = document.createElement('img'); // Create an <img> element
        imageElement.src = imageURL; // Set the image source
        imageElement.alt = character; // Set alt text for accessibility
        imageElement.classList.add('character-image'); // Optional: add a CSS class for styling

        // Assume there's a div to display the pull result
        const resultDisplay = document.getElementById('resultDisplay'); // Get the result display container
        resultDisplay.appendChild(imageElement); // Append the image to the display
    } else {
        console.error('Image for the character not found!');
    }
}

// // Example of pulling a character and showing its image
// function handlePullResult(characterName) {
//     // Show the character's image based on the pull result
//     showCharacterImage(characterName);

//     // Continue with your existing code for showing the pull results (rarity, etc.)
// }

class GachaSimulator {
    constructor() {
        this.rates = {
            3: 0.03,  // 3% chance for 3-star
            2: 0.17,  // 17% chance for 2-star
            1: 0.80   // 80% chance for 1-star
        };

        this.characters = {
            3: ['Gelas Kopi', 'Motor', 'STNK Vitram'],
            2: ['Home Page', 'MAGE X', 'Tablet'],
            1: ['Yoru', 'Skelly', 'Hard']
        };

        this.currentPulls = [];
        this.currentCharacters = [];
        this.currentPullIndex = 0;
        this.isActive = false;
        this.flashTimeout = null;
        this.endTimeout = null;
        this.username = null;
    }

    pull() {
        // const rand = Math.random();
        // if (rand < this.rates[3]) return 3;
        // if (rand < this.rates[3] + this.rates[2]) return 2;
        // return 1;

        const rand = Math.random();
        let rarity;
        if (rand < this.rates[3]) rarity = 3;
        else if (rand < this.rates[3] + this.rates[2]) rarity = 2;
        else rarity = 1;
        
        // Select a random character from the pool of the chosen rarity
        const characters = this.characters[rarity];
        const character = characters[Math.floor(Math.random() * characters.length)];

        // Store both rarity and character
        this.currentCharacters.push({ rarity, character });
        return rarity;  // Keep original return for compatibility
    }

    pullTen() {
        this.currentCharacters = []
        return Array.from({length: 10}, () => this.pull());
    }

    // Method to save pull history to the server
    async savePullHistory() {
        if (!this.username) {
            console.error('Username not set. Cannot save pull history.');
            return null;
        }

        try {
            const pullData = this.currentCharacters.map(pull => ({
                rarity: pull.rarity,
                character: pull.character
            }));

            const response = await fetch('/pull-history', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: this.username,
					timestamp: new Date().toISOString(),  // Add timestamp
                    // pulls: this.currentPulls
                    pulls:pullData
                })
            });

            const result = await response.json();
            console.log('Pull history saved:', result);
            return result;
        } catch (error) {
            console.error('Error saving pull history:', error);
            return null;
        }
    }

    // Method to retrieve pull history from the server
    async getPullHistory() {
        if (!this.username) {
            console.error('Username not set. Cannot retrieve pull history.');
            return null;
        }

        try {
            const response = await fetch(`/pull-history/${this.username}`);
            const result = await response.json();
            console.log('Pull history retrieved:', result);
            return result.pullHistory;
        } catch (error) {
            console.error('Error retrieving pull history:', error);
            return null;
        }
    }

    // Method to update an existing pull history entry
    async updatePullHistory(pullHistoryId, updateData) {
        try {
            const response = await fetch(`/pull-history/${pullHistoryId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });

            const result = await response.json();
            console.log('Pull history updated:', result);
            return result;
        } catch (error) {
            console.error('Error updating pull history:', error);
            return null;
        }
    }
}

// Initialize gacha simulator
const gacha = new GachaSimulator();
let resultDisplay = document.getElementById('resultDisplay');
const historyDiv = document.getElementById('history');
const usernameInput = document.getElementById('usernameInput');
const setUsernameButton = document.getElementById('setUsernameButton');
const usernameLoggedIn = document.getElementById('usernameLoggedIn');

// Add these functions to handle username storage
function saveUsername(username) {
    localStorage.setItem('gachaUsername', username);
}

function getStoredUsername() {
    return localStorage.getItem('gachaUsername');
}

function clearStoredUsername() {
    localStorage.removeItem('gachaUsername');
}

async function initializeGacha() {
	const storedUsername = getStoredUsername();
    
    if (storedUsername) {
        gacha.username = storedUsername;
        usernameInput.value = storedUsername;  // Update the input field
        await displayPastPullHistory();  // Load history immediately
		usernameLoggedIn.textContent = storedUsername;
    }
}

// Username setting functionality
setUsernameButton.addEventListener('click', async () => {
    const username = usernameInput.value.trim();
    if (username) {
        gacha.username = username;
		saveUsername(username);
        alert(`Username set to: ${username}`);
		usernameLoggedIn.textContent = username;
		
		// Reset some elements as if they are newly refreshed
		clearAllTimeouts();
		resultDisplay.textContent = 'Klik tombol di bawah untuk memulai roll!';
		resultDisplay.classList.remove('star-1', 'star-2', 'star-3', 'flash');
		resultDisplay.style.backgroundColor = '';
		gacha.currentPullIndex = 0;
		toggleButton.disabled = false;
		toggleButton.classList.remove('disabled');
		toggleAnimations.stopInterval();
		toggleAnimations.startInterval();
		
		if (gacha.isActive) {
			gacha.isActive = false;
			
			// Force remove any remaining click handlers
			resultDisplay.replaceWith(resultDisplay.cloneNode(true));
			// Get the fresh reference after cloning
			resultDisplay = document.getElementById('resultDisplay');	
		}
		
		// Clear existing history display before showing new user's history
        historyDiv.innerHTML = '';
		
        // Fetch and display previous pull history
        await displayPastPullHistory();
    } else {
        alert('Please enter a valid username');
    }
});

// Function to display past pull history
async function displayPastPullHistory() {
    try {
        const pullHistory = await gacha.getPullHistory();
        
        if (!pullHistory || pullHistory.length === 0) {
            console.log('No previous pull history found');
            return;
        }

        // Sort pull history by timestamp (newest first)
        pullHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // Display each pull session
        pullHistory.forEach(session => {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'history-group';
            
            const timestamp = document.createElement('div');
            try {
                const pullDate = new Date(session.timestamp);
                timestamp.textContent = `Pull session: ${pullDate.toLocaleString()}`; // Use localeString for better formatting
            } catch (error) {
                console.error('Error parsing timestamp:', error);
                timestamp.textContent = 'Pull session: Time unknown';
            }
            groupDiv.appendChild(timestamp);

            const sequenceDiv = document.createElement('div');
            sequenceDiv.className = 'pull-sequence';
            
            // Loop through each pull in the session
            session.pulls.forEach(pull => {
                const pullDiv = document.createElement('div');
                pullDiv.className = `pull-result star-${pull.rarity}`;  // Use pull.rarity instead of stars
                pullDiv.textContent = `${pull.character} (${pull.rarity}★)`;  // Corrected display

                sequenceDiv.appendChild(pullDiv);
                
                // Force reflow and add visible class for animation
                setTimeout(() => {
                    pullDiv.offsetHeight;  // Force reflow
                    pullDiv.classList.add('visible');
                }, 50);
            });

            groupDiv.appendChild(sequenceDiv);
            historyDiv.appendChild(groupDiv);
        });
    } catch (error) {
        console.error('Error displaying pull history:', error);
    }
}


function createNewPullGroup() {
    const groupDiv = document.createElement('div');
    groupDiv.className = 'history-group';
    
    const timestamp = document.createElement('div');
    timestamp.textContent = `Pull session: ${new Date().toLocaleTimeString()}`;
    groupDiv.appendChild(timestamp);

    const sequenceDiv = document.createElement('div');
    sequenceDiv.className = 'pull-sequence';
    groupDiv.appendChild(sequenceDiv);

    historyDiv.insertBefore(groupDiv, historyDiv.firstChild);
    return sequenceDiv;
}

function addPullToSequence(sequenceDiv, stars, character) {
    const pullDiv = document.createElement('div');
    pullDiv.className = `pull-result star-${stars}`;
    pullDiv.textContent = `${character} (${stars}★)`;
    sequenceDiv.appendChild(pullDiv);
    
    pullDiv.offsetHeight;  // Force reflow
    pullDiv.classList.add('visible');
}

function clearPullDisplay() {
    resultDisplay.textContent = 'Klik disini untuk roll x1!';
    resultDisplay.classList.remove('star-1', 'star-2', 'star-3', 'flash');
    resultDisplay.style.backgroundColor = '';
}

function endPullSession() {
    clearAllTimeouts();
    resultDisplay.textContent = 'Klik tombol untuk memulai lagi!';
    resultDisplay.classList.remove('star-1', 'star-2', 'star-3', 'flash');
    resultDisplay.style.backgroundColor = '';
    gacha.isActive = false;
    toggleButton.disabled = false;
	toggleButton.classList.remove('disabled');
	toggleAnimations.startInterval();

	/*
    // Save pull history to server
    if (gacha.username) {
        gacha.savePullHistory();
    }
	*/
}

function clearAllTimeouts() {
    if (gacha.flashTimeout) {
        clearTimeout(gacha.flashTimeout);
        gacha.flashTimeout = null;
    }
    if (gacha.endTimeout) {
        clearTimeout(gacha.endTimeout);
        gacha.endTimeout = null;
    }
}

function showPull(stars, character, sequenceDiv) {
    clearAllTimeouts();
    
    // First, show the star color and text
    resultDisplay.classList.remove('star-1', 'star-2', 'star-3', 'flash');
    resultDisplay.classList.add(`star-${stars}`);
    resultDisplay.textContent = `${character} (${stars}★)`;

    showCharacterImage(character);
    
    addPullToSequence(sequenceDiv, stars, character);

    // Then flash white
    gacha.flashTimeout = setTimeout(() => {
        resultDisplay.classList.add('flash');
        
        // Return to star color
        gacha.endTimeout = setTimeout(() => {
            resultDisplay.classList.remove('flash');
            
            // If there are more pulls, show "Click to reveal"
            if (gacha.currentPullIndex < gacha.currentPulls.length) {
                clearPullDisplay();
            }
        }, 100);
    }, 900);
}

// Modified to handle history display
async function startNewPullSession() {
	const storedUsername = getStoredUsername();
	
    // Check if username is set
    if (!gacha.username) {
        alert('Please set a username first!');
        return;
    }
	
	if (storedUsername !== gacha.username) {
		gacha.username = storedUsername;  // Sync username if it somehow got out of sync
	}

    clearAllTimeouts();
    gacha.currentPulls = gacha.pullTen();
    gacha.currentPullIndex = 0;
    gacha.isActive = true;
    toggleButton.disabled = true;
	toggleButton.classList.add('disabled');
	toggleAnimations.stopInterval();
    
	try {
		// Save pulls to MongoDB first before showing results
		const savedPullHistory = await gacha.savePullHistory();
		
		if (!savedPullHistory) {
			throw new Error('Failed to save pull history');
		}
		
		// Only proceed with UI updates after successful save
		const sequenceDiv = createNewPullGroup();
		clearPullDisplay();

		const clickHandler = () => {
			if (!gacha.isActive) return;

			// If we've shown all pulls, end the session immediately
			if (gacha.currentPullIndex >= gacha.currentPulls.length) {
				endPullSession();
				resultDisplay.removeEventListener('click', clickHandler);
				return;
			}

			const {rarity, character} = gacha.currentCharacters[gacha.currentPullIndex];
			showPull(rarity, character, sequenceDiv);
			gacha.currentPullIndex++;

			// If this was the last pull, remove the click handler after animation
			if (gacha.currentPullIndex >= gacha.currentPulls.length) {
				gacha.endTimeout = setTimeout(() => {
					endPullSession();
					resultDisplay.removeEventListener('click', clickHandler);
				}, 1000);
			}
		};
		
		resultDisplay.addEventListener('click', clickHandler);
	} catch (error) {
		console.error('Failed to start pull session:', error);
        alert('Failed to start pull session. Please try again.');
        toggleButton.disabled = false;
        toggleButton.classList.remove('disabled');
        toggleAnimations.startInterval();
        gacha.isActive = false;
    }
}

toggleButton.addEventListener('click', startNewPullSession);
document.addEventListener('DOMContentLoaded', initializeGacha);