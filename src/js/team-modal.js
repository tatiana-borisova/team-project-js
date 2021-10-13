import refs from './refs';
import teamCardTmpl from '../templates/team-card.hbs';
import teamData from '../json/team-info.json';
import * as basicLightbox from 'basiclightbox';

refs.teamContainer.insertAdjacentHTML('beforeend', teamCardTmpl(teamData));
refs.developerLink.addEventListener('click', showTeamModal);

function showTeamModal(e) {
  e.preventDefault();
  const instance = basicLightbox.create(document.querySelector('.team-modal'));

  instance.show();
}
