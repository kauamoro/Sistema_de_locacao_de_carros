import Order from '../models/Order';
import axios from 'axios';
import { UUID } from 'crypto';
import { AppError } from '../../../shared/errors/AppError';

interface ExecuteParams {
    id: UUID | string;
    DataInicial: Date;
    DataFinal: Date;
    CEP: string;
    status: 'Aberto' | 'Aprovado' | 'Cancelado';
}

export default class UpdateOrderService {
    public async execute ({ id, DataInicial, DataFinal, CEP, status}: ExecuteParams) {
         //verificar se o order existe
         const order = await Order.findByPk(id);
         if (!order) {
             throw new AppError("Pedido não encontrado!", 404);

         }

         //verificar se data inicial é menor que a data de hoje
         const today = new Date();
         if (DataInicial < today) {
             throw new AppError(`${DataInicial} essa data é menor que ${today}`, 400);
         }

         //verificar se data final é menor que a data inicial
         if (DataFinal < DataInicial) {
             throw new AppError(`${DataFinal} essa data é menor que ${DataInicial}`, 400);
         }
         // update do CEP

         let Cidade = null;
         let UF = null;

         if (CEP) {
            const response = await axios.get(`https://viacep.com.br/ws/${CEP}/json/`,);
            const data = response.data;

            if (data && !data.erro) {
                const ufs = ['AL', 'BA', 'CE', 'MA', 'PB', 'PE', 'PI', 'RN', 'SE'];
                if (!ufs.includes(data.uf)) {
                    throw new AppError(`${data.uf} no momento não temos filiais nessa região`, 400);
                }
                Cidade = data.localidade;
                UF = data.uf;
            }
            if (data.erro){
                throw new AppError('CEP inválido', 400);
            }
         }

         //verificação de status
         if (status === 'Aprovado') {
            if (order.status != 'Aberto') {
                throw new AppError("O pedido deve estar em aberto para ser aprovado");

            }
            if (!id || !DataInicial || !DataFinal || !CEP || !status) {
                throw new AppError("Todos os campos devem estar preenchidos para aprovar o pedido")
            }
         }

         if (status === 'Cancelado') {
            if (order.status != 'Aberto') {
                throw new AppError("O pedido deve estar em aberto para ser aprovado");

            }
            order.DataCancelamento = today;
         }

         await order.update({
            DataInicial,
            DataFinal,
            CEP,
            Cidade,
            UF,
            status,
            DataCancelamento: status === 'Cancelado' ? order.DataCancelamento: null
         });

         return order;
    }
}
