const addButton = document.querySelector('.addButton');
const input = document.querySelector('.input');
const dateInput = document.querySelector('.date');
const workType = document.querySelector('.workType');
const taskType = document.querySelector('.taskType');
const todayContainer = document.querySelector('.tasks.today');
const tomorrowContainer = document.querySelector('.tasks.tomorrow');
const message = document.getElementById('message');
const sparkle = document.getElementById('sparkle');
const celebrationSound = document.getElementById('celebrationSound');

let completedTaskCount = 0;
let totalTaskCount = 0;
let overallStartTime = null;

class Item {
    constructor(itemName, dueDate, workType, taskType) {
        this.startTime = new Date();
        if (!overallStartTime) {
            overallStartTime = this.startTime;
        }
        this.createDiv(itemName, dueDate, workType, taskType);
        totalTaskCount++;
    }

    createDiv(itemName, dueDate, workType, taskType) {
        let input = document.createElement('input');
        input.value = itemName;
        input.disabled = true;
        input.classList.add('item_input');
        input.type = "text";

        let dateSpan = document.createElement('span');
        dateSpan.classList.add('date_span');
        dateSpan.innerHTML = `Due: ${dueDate}`;

        let workTypeSpan = document.createElement('span');
        workTypeSpan.classList.add('workType_span');
        workTypeSpan.innerHTML = `Type: ${workType}`;

        let itemBox = document.createElement('div');
        itemBox.classList.add('item');

        let editButton = document.createElement('button');
        editButton.innerHTML = "EDIT";
        editButton.classList.add('editButton');

        let completedButton = document.createElement('button');
        completedButton.innerHTML = "TASK COMPLETED";
        completedButton.classList.add('completedButton');

        let removeButton = document.createElement('button');
        removeButton.innerHTML = "REMOVE";
        removeButton.classList.add('removeButton');

        let timerSpan = document.createElement('span');
        timerSpan.classList.add('timer');
        timerSpan.innerHTML = "Timer: 0s";

        let durationSpan = document.createElement('span');
        durationSpan.classList.add('duration');
        durationSpan.innerHTML = "";

        if (taskType === 'today') {
            todayContainer.appendChild(itemBox);
        } else if (taskType === 'tomorrow') {
            tomorrowContainer.appendChild(itemBox);
        }

        itemBox.appendChild(input);
        itemBox.appendChild(dateSpan);
        itemBox.appendChild(workTypeSpan);
        itemBox.appendChild(timerSpan);
        itemBox.appendChild(durationSpan);
        itemBox.appendChild(editButton);
        itemBox.appendChild(completedButton);
        itemBox.appendChild(removeButton);

        editButton.addEventListener('click', () => this.edit(input));
        completedButton.addEventListener('click', () => this.complete(input, timerSpan, durationSpan, completedButton));
        removeButton.addEventListener('click', () => this.remove(itemBox));

        this.timerInterval = setInterval(() => {
            const elapsedTime = Math.floor((new Date() - this.startTime) / 1000);
            timerSpan.innerHTML = `Timer: ${elapsedTime}s`;
        }, 1000);
    }

    edit(input) {
        input.disabled = !input.disabled;
        input.focus();
    }

    complete(input, timerSpan, durationSpan, completedButton) {
        if (completedButton.disabled) return; // Prevent repeated clicks
        clearInterval(this.timerInterval);
        input.classList.toggle('completed');
        const elapsedTime = Math.floor((new Date() - this.startTime) / 1000);
        timerSpan.innerHTML = `Completed in: ${elapsedTime}s`;
        durationSpan.innerHTML = ""; // Clear the duration span to avoid repetition

        completedTaskCount++;
        completedButton.disabled = true; // Disable button after completion

        if (completedTaskCount === totalTaskCount) {
            const totalElapsedTime = Math.floor((new Date() - overallStartTime) / 1000);
            this.showMessage(`Woohoo! You completed all tasks! Total time: ${totalElapsedTime}s`);
            this.showSparkle();
            celebrationSound.play();
        } else {
            this.showMessage(`Yay! You completed ${completedTaskCount} task${completedTaskCount > 1 ? 's' : ''}!`);
        }
    }

    remove(item) {
        clearInterval(this.timerInterval);
        if (todayContainer.contains(item)) {
            todayContainer.removeChild(item);
        } else if (tomorrowContainer.contains(item)) {
            tomorrowContainer.removeChild(item);
        }
        totalTaskCount--;

        // Update the message if there are no tasks left
        if (totalTaskCount === 0) {
            completedTaskCount = 0; // Reset the count
            overallStartTime = null; // Reset the overall start time
            message.innerHTML = ""; // Clear the message
        }
    }

    showMessage(text) {
        message.innerHTML = text;
        setTimeout(() => {
            message.innerHTML = "";
        }, 3000);
    }

    showSparkle() {
        const sparkleCount = 50; // Number of sparkles
        for (let i = 0; i < sparkleCount; i++) {
            const sparkleElem = document.createElement('div');
            sparkleElem.classList.add('sparkle-fall');
            sparkleElem.style.left = `${Math.random() * 100}vw`;
            sparkleElem.style.top = `${Math.random() * 100}vh`;
            sparkleElem.innerHTML = '✨'; // You can use any symbol or emoji
            sparkle.appendChild(sparkleElem);
        }
        sparkle.classList.remove('hidden');
        setTimeout(() => {
            sparkle.classList.add('hidden');
            while (sparkle.firstChild) {
                sparkle.removeChild(sparkle.firstChild);
            }
        }, 2000); // Match duration of animation
    }
}

function check() {
    const selectedTaskType = taskType.value;
    
    if (input.value.trim() !== "" && dateInput.value && workType.value) {
        new Item(input.value.trim(), dateInput.value, workType.value, selectedTaskType);
        input.value = "";
        dateInput.value = "";
        workType.value = "work";
        taskType.value = "today"; // Reset task type to default
    }
}

addButton.addEventListener('click', check);
window.addEventListener('keydown', (e) => {
    if (e.which === 13) {
        check();
    }
});
