import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsComponent } from './analytics.component';
import {HttpModule} from '@angular/http';
import {MatDialogModule} from '@angular/material/dialog';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {AmazonWebService} from '../services/amazonweb.service';

describe('AnalyticsComponent', () => {
  let component: AnalyticsComponent;
  let fixture: ComponentFixture<AnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsComponent ],
      imports: [ HttpModule, MatDialogModule ],
      providers: [ AmazonWebService, {provide: MAT_DIALOG_DATA, useValue:
          { response: [{'Timestamp': '2018-03-23T01:50:20.000Z', 'Average': '1'}]}},
        {provide: MatDialogModule, useValue: {}}, {provide: MatDialogRef, useValue: {}} ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
