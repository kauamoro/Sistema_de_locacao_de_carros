import { AppError } from '../../../shared/errors/AppError';
import Order from '../models/Order';
import car from '../../car/models/car.model';
import Customer from '../../customer/models/Customer';




export default class ReadOrderService {
    public async execute ( id: string ) {

        const searchOrder = await Order.findOne({
            where: {id},
            include: [{
                model: car,
                attributes: {
                    exclude: [ 'price', 'registrationDate', 'status', 'createdAt', 'updatedAt', 'deletedAt']
                },
            },
            {
                model: Customer,
                attributes: {
                    exclude: [ 'telefone', 'dataCadastro', 'dataExclusao' ],
                },
            }],
        });

        if (!searchOrder) {
            throw new AppError('Pedido não encontrado', 404);
        }


        return searchOrder;
    }

}
