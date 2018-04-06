import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AmazonWebService } from '../../services/amazonweb.service';
import { JanitorComponent } from '../janitor.component';

@Component({
  selector: 'app-janitor-dialog',
  templateUrl: './janitordialog.component.html',
  styleUrls: ['./janitordialog.component.css']
})
export class JanitorDialogComponent {

  public janitorConfig: JanitorProperties = {
    defaultEmail: '',
    summaryEmail: '',
    sourceEmail: '',
    isMonkeyTime: true,
    threshold: null,
  };

  constructor(public dialogRef: MatDialogRef<JanitorDialogComponent>,
    private amazonWebService: AmazonWebService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  close() {
    this.dialogRef.close();
  }

  runJanitor() {
    this.amazonWebService.runJanitor(this.janitorConfig).subscribe(data => {
      this.dialogRef.close();
    });
  }
}

export interface JanitorProperties {
  defaultEmail: string;
  summaryEmail: string;
  sourceEmail: string;
  isMonkeyTime: boolean;
  threshold: number;
}
