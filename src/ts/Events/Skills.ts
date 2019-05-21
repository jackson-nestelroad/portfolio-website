// Drawing the skills in the Skills section

import { DOM } from '../Modules/DOM'
import { SkillsGrid } from '../Modules/WebPage'
import { SkillData, Skill } from '../Classes/Elements/Skill'
import { Skills } from '../Data/Skills'
import { ElementFactory } from '../Definitions/JSX'

DOM.load().then(document => {
    createSkills(Skills);
});

// Draws all skills in the grid
const createSkills = (skillsData: Array<SkillData>) => {
    // Make sure our class it initialized first, since it is async
    Skill.initialize().then(async (done) => {
        if(!done) {
            throw "Could not initialize Skills object.";
        }
        let skill: Skill;
        let element;
        for(let data of skillsData) {
            skill = new Skill(data);
            element = await skill.createElement();
            SkillsGrid.appendChild(element);
        }
    })
}