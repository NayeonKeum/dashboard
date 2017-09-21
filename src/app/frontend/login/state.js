// Copyright 2017 The Kubernetes Dashboard Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/** Name of the state. */
export const stateName = 'login';

/** Absolute URL of the state. */
export const stateUrl = '/login';

/**
 * Parameters for this state.
 */
export class StateParams {
  /**
   * @param {!angular.$http.Response} [error]
   */
  constructor(error) {
    /** @type {!angular.$http.Response|undefined} */
    this.error = error;
  }
}