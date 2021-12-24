import { NegociacaoController } from './controllers/NegociacaoController';

const controller = new NegociacaoController();

// document
//     .querySelector('.form')
//     .addEventListener('submit', controller.adiciona.bind(controller));

// COM JQUERY
$('.form').submit(controller.adiciona.bind(controller));
$('#botao-importar').click(controller.importarDados.bind(controller));