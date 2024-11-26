import { AppError } from '../../../shared/errors/AppError';
import Order from '../models/Order';
import Car from '../../car/models/car.model';
import Customer from '../../customer/models/Customer';
import axios from 'axios';

interface ExecuteParams {
    email: string;
    plate: string;
    CEP: string;
}

export default class CreaterOrderService {
    public async execute({ email, plate, CEP }: ExecuteParams) {
            //verificar se o cliente existe
            const customers = await Customer.findOne({
                where: { email },
            });

            if (!customers) {
                throw new AppError('Cliente não encontrado', 404);
            }


            //verificar se o carro existe
            const searchCar = await Car.findOne({
                where: { plate },
            });

            if (!searchCar) {
                throw new AppError('Carro não encontrado', 404);
            }

            //verificar se o cliente já possui pedido em aberto
            const searchOrder = await Order.findOne({
                where: { cliente: customers.id, Status: 'Aberto' },
            });

            if (searchOrder) {
                throw new AppError('Cliente já possui pedido em aberto', 400);
            }

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

            //criar pedido
            const order = await Order.create({
                cliente: customers.id,
                CarroPedido: searchCar.id,
                CEP,
                Cidade, // pegar da API externa
                UF, // pegar da API externa
                ValorTotal: searchCar.price, // Usar o preço do carro encontrado
                dataFinal: null,
                dataCancelamento: null,
                status: 'Aberto',
            });

            return order;
    }

}
