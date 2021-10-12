import refs from './refs'
import teamCardTmpl from '../templates/team-card.hbs'
import teamData from '../json/team-info.json'

console.log(teamCardTmpl(teamData));
refs.teamContainer.insertAdjacentHTML("beforeend", teamCardTmpl(teamData))