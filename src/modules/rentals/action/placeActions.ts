import { Place } from '../hook/usePlaces';

export const PLACE_ACTIONS = {
  FETCH_PLACES: 'FETCH_PLACES',
  FETCH_PLACE: 'FETCH_PLACE',
  CREATE_PLACE: 'CREATE_PLACE',
  UPDATE_PLACE: 'UPDATE_PLACE',
  DELETE_PLACE: 'DELETE_PLACE',
};

export interface FetchPlacesAction {
  type: typeof PLACE_ACTIONS.FETCH_PLACES;
  payload: Place[];
}

export interface FetchPlaceAction {
  type: typeof PLACE_ACTIONS.FETCH_PLACE;
  payload: Place;
}

export interface CreatePlaceAction {
  type: typeof PLACE_ACTIONS.CREATE_PLACE;
  payload: Place;
}

export interface UpdatePlaceAction {
  type: typeof PLACE_ACTIONS.UPDATE_PLACE;
  payload: Place;
}

export interface DeletePlaceAction {
  type: typeof PLACE_ACTIONS.DELETE_PLACE;
  payload: string; // id
}

export type PlaceActions =
  | FetchPlacesAction
  | FetchPlaceAction
  | CreatePlaceAction
  | UpdatePlaceAction
  | DeletePlaceAction;
