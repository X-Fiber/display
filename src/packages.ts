import axios from 'axios';

// external
import joi from 'joi';
import { jwtDecode } from 'jwt-decode';
import { create } from 'zustand';
import { persist, createJSONStorage, devtools } from 'zustand/middleware';
import { Container, ContainerModule } from 'inversify';
import { EventEmitter } from 'eventemitter3';

export { joi };
export { axios };
export { injectable, inject } from 'inversify';

export const jwt = {
  decode: jwtDecode,
};
export const inversify = { Container, ContainerModule };

export const events = {
  EventEmitter: EventEmitter,
};

export const zustand = {
  create: create,
  persist: persist,
  createJSONStorage: createJSONStorage,
  devtools: devtools,
};
