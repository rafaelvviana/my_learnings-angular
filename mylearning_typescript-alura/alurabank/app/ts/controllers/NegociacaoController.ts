import { MensagensView, NegociacoesView } from '../views/index';
import { Negociacao, Negociacoes } from '../models/index';
import { domInject, throttle } from '../helpers/decorators/index';
import { NegociacaoParcial } from '../models/index';
import { NegociacaoService } from '../services/index';
import { imprime } from '../helpers/index';

export class NegociacaoController{

    // private _inputData: HTMLInputElement;
    // private _inputQuantidade: HTMLInputElement;
    // private _inputValor: HTMLInputElement;
    
    // private _negociacoes = new Negociacoes();
    // private _negociacoesView = new NegociacoesView('#negociacoesView');
    // private _mensagensView = new MensagensView('#mensagemView');

    // constructor(){ 

    //     this._inputData = <HTMLInputElement>document.querySelector('#data');
    //     this._inputQuantidade = <HTMLInputElement>document.querySelector('#quantidade');
    //     this._inputValor = <HTMLInputElement>document.querySelector('#valor');

    //     this._negociacoesView.update(this._negociacoes);

    // }

    // adiciona(event: Event){

    //     event.preventDefault();

    //     const negociacao = new Negociacao(
    //         new Date(this._inputData.value.replace(/-/g, ',')),
    //         parseInt(this._inputQuantidade.value),
    //         parseFloat(this._inputValor.value)
    //     );

    //     this._negociacoes.adiciona(negociacao);

    //     // depois de adicionar, atualiza a view novamente para refletir os dados
    //     this._negociacoesView.update(this._negociacoes);

    //     this._mensagensView.update('Negociação incluída com sucesso.');
        
    // }

    
    // COM JQUERY
    @domInject('#data')
    private _inputData: JQuery;

    @domInject('#quantidade')
    private _inputQuantidade: JQuery;

    @domInject('#valor')
    private _inputValor: JQuery;
    private _negociacoes = new Negociacoes();
    private _negociacoesView = new NegociacoesView('#negociacoesView');
    private _mensagemView = new MensagensView('#mensagemView');

    private _service = new NegociacaoService();


    constructor() {
        this._negociacoesView.update(this._negociacoes);
    }

    @throttle()
    adiciona() {
        let data = new Date(this._inputData.val().replace(/-/g, ','));

        if (! this._ehDiaUtil(data)) {
            this._mensagemView.update('Somente negociações em dias úteis, por favor!');
            return;
        }


        const negociacao = new Negociacao(
            data, 
            parseInt(this._inputQuantidade.val()),
            parseFloat(this._inputValor.val())
        );

        this._negociacoes.adiciona(negociacao);
        this._negociacoesView.update(this._negociacoes);
        this._mensagemView.update('Negociação adicionada com sucesso');

        // imprime no console a negociacao
        imprime(negociacao, this._negociacoes);
    }


    private _ehDiaUtil(data: Date) {
        return data.getDay () != DiaDaSemana.Domingo && data.getDay() != DiaDaSemana.Sabado;
    }

    // @throttle()
    // importarDados() {
    //     function isOk(res: Response) {
    //         if(res.ok) {
    //             return res;
    //         } else {
    //             throw new Error(res.statusText);
    //         }
    //     }
    //     this._service
    //         .obterNegociacoes(res => {
    //             if(res.ok) return res;
    //             throw new Error(res.statusText);
    //         })
    //         .then(negociacoesParaImportar => {
    //             const negociacoesJaImportadas = this._negociacoes.paraArray();
    //             negociacoesParaImportar
    //                 .filter(negociacao => 
    //                     !negociacoesJaImportadas.some(jaImportada => 
    //                         negociacao.ehIgual(jaImportada)))
    //                 .forEach(negociacao => 
    //                 this._negociacoes.adiciona(negociacao));
    //             this._negociacoesView.update(this._negociacoes);
    //         })
    //         .catch(err => {
    //             this._mensagemView.update(err.message);
    //         });      
    // }

    // OUTRA FORMA DE IMPLEMENTAR O CODIGO ACIMA DE FORMA ASSINCRONA
    @throttle()
    async importaDados() {

        try {

           // usou await antes da chamada de this.service.obterNegociacoes()

            const negociacoesParaImportar = await this._service
                .obterNegociacoes(res => {

                    if(res.ok) {
                        return res;
                    } else {
                        throw new Error(res.statusText);
                    }
                });

            const negociacoesJaImportadas = this._negociacoes.paraArray();

            negociacoesParaImportar
                .filter(negociacao => 
                    !negociacoesJaImportadas.some(jaImportada => 
                        negociacao.ehIgual(jaImportada)))
                .forEach(negociacao => 
                this._negociacoes.adiciona(negociacao));

            this._negociacoesView.update(this._negociacoes);

        } catch(err) {
            this._mensagemView.update(err.message);
        }
    }

}

enum DiaDaSemana{
    Domingo,
    Segunda,
    Terca,
    Quarta,
    Quinta,
    Sexta,
    Sabado
}