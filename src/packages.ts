import axios from 'axios';

// external
import joi from 'joi';
import { jwtDecode } from 'jwt-decode';
import { create, createStore } from 'zustand';
import { persist, createJSONStorage, devtools } from 'zustand/middleware';
import { Container, ContainerModule } from 'inversify';

export { joi };
export { axios };
export { injectable, inject } from 'inversify';

export const jwt = {
  decode: jwtDecode,
};
export const inversify = { Container, ContainerModule };

export const zustand = {
  create: create,
  createStore: createStore,
  persist: persist,
  createJSONStorage: createJSONStorage,
  devtools: devtools,
};
