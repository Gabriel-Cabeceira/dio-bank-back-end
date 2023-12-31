import { UserService } from "./UserService"
import * as jwt from 'jsonwebtoken';


jest.mock('../repositories/UserRespository');
jest.mock('../database', () => {
    initialize: jest.fn()
});
jest.mock('jsonwebtoken')

const mockUserRepository = require('../repositories/UserRespository')

describe('UserService', () => {
    
    const userService = new UserService(mockUserRepository);
    const mockUser = {
        user_id: '12345',
        name: 'Teste da Silva',
        email: 'teste@test.com',
        password: 'Senha123'
    }


    it('Deve adicionar um novo usuário', async () => {
        mockUserRepository.createUser = jest.fn().mockImplementation(() => Promise.resolve(mockUser))

        const response = await userService.createUser('Teste da Silva', 'teste@test.com', 'Senha123')

        expect(mockUserRepository.createUser).toHaveBeenCalled();
        expect(response).toMatchObject(
            {
                user_id: '12345',
                name: 'Teste da Silva',
                email: 'teste@test.com',
                password: 'Senha123'
            }
        )
    })


    it('Devo retornar um token de usuário', async () => {

        jest.spyOn(userService, 'getAuthenticatedUser').mockImplementation(() => Promise.resolve(mockUser))

        jest.spyOn(jwt, 'sign').mockImplementation(() => 'token')

        const token = await userService.getToken('gabriel@dio.com', 'Senha123');

        expect(token).toBe(token)
    })

    it('Deve retornar um erro caso não encontre um usuário', async () => {

        jest.spyOn(userService, 'getAuthenticatedUser').mockImplementation(() => Promise.resolve(null))

        await expect(userService.getToken('invalid@test.com', '1234')).rejects.toThrow(new Error('Email ou Senha inválidos'))
    })

})