'use strict';

(function() {
    const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

    async function handleSkillBar(selector = '') {
        const bar = document.querySelector(selector);
        if(!bar) {
            return;
        }
        const skills = bar.querySelectorAll('li');
        const totalSkills = skills.length - 1;

        let index = -1;

        while(index <= totalSkills) {
            index++;
            let currentSkill = skills[index];
            if(!currentSkill) {
                continue;
            }
            await sleep(400);
            let value = currentSkill.dataset.value + '%';
            currentSkill.style.setProperty('--width', value);
            
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        (async() => {
            await handleSkillBar('.skills');
        })();
    }, false);
})();