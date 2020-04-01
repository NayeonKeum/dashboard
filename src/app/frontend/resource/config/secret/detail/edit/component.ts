// Copyright 2017 The Kubernetes Authors.
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

import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {SecretDetail} from '@api/backendapi';
import {RawResource} from 'common/resources/rawresource';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {AlertDialogConfig, AlertDialog} from 'common/dialogs/alert/dialog';
import {MatDialogConfig, MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'kd-secret-detail-edit',
  templateUrl: './template.html',
  styleUrls: ['./style.scss'],
})
export class SecretDetailEditComponent implements OnInit {
  @Output() onClose = new EventEmitter<boolean>();
  @Input() set editing(value: boolean) {
    this.editing_ = value;
    this.updateText();
  }
  get editing(): boolean {
    return this.editing_;
  }
  @Input() set secret(value: SecretDetail) {
    this.secret_ = value;

    if (!this.editing) {
      this.updateText();
    }
  }
  get secret(): SecretDetail {
    return this.secret_;
  }
  @Input() key: string;
  text = '';
  private secret_: SecretDetail;
  private editing_ = false;

  constructor(private readonly dialog_: MatDialog, private readonly http_: HttpClient) {}

  ngOnInit(): void {
    this.updateText();
  }

  update(): void {
    // Get the latest raw resource, and update it.
    const url = RawResource.getUrl(this.secret.typeMeta, this.secret.objectMeta);
    this.http_
      .get(url)
      .toPromise()
      .then((resource: any) => {
        const dataValue = this.encode(this.text);
        resource.data[this.key] = this.encode(this.text);
        const url = RawResource.getUrl(this.secret.typeMeta, this.secret.objectMeta);
        this.http_
          .put(url, resource, {headers: this.getHttpHeaders_(), responseType: 'text'})
          .subscribe(() => {
            // Update current data value for secret, so refresh isn't needed.
            this.secret_.data[this.key] = dataValue;
            this.onClose.emit(true);
          }, this.handleErrorResponse_.bind(this));
      });
  }

  cancel(): void {
    this.onClose.emit(true);
  }

  updateText(): void {
    this.text = this.secret && this.key ? this.decode(this.secret.data[this.key]) : '';
  }

  getHttpHeaders_(): HttpHeaders {
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');
    return headers;
  }

  decode(s: string): string {
    return atob(s);
  }

  encode(s: string): string {
    return btoa(s);
  }

  handleErrorResponse_(err: HttpErrorResponse): void {
    if (err) {
      const alertDialogConfig: MatDialogConfig<AlertDialogConfig> = {
        width: '630px',
        data: {
          title: err.statusText === 'OK' ? 'Internal server error' : err.statusText,
          message: err.error || 'Could not perform the operation.',
          confirmLabel: 'OK',
        },
      };
      this.dialog_.open(AlertDialog, alertDialogConfig);
    }
  }
}