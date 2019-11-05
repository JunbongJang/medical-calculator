import { Component, OnInit } from '@angular/core';
import {split} from 'ts-node';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  objectKeys = Object.keys;
  chief_complaints = {};
  ct_numbers = {};
  ct_output_string = '';
  ct_output_array = [];
  alert_show_bool = false;

  constructor() { }

  ngOnInit() {
    this.readTextFile('assets/text/chief_complaints.txt', 'input');
    this.readTextFile('assets/text/ct_output.txt', 'output');

    console.log(this.chief_complaints);
    console.log(this.ct_numbers);
  }


  readTextFile(file: string, type: string) {
    const rawFile = new XMLHttpRequest();
    rawFile.open('GET', file, false);
    rawFile.onreadystatechange = () => {
      if (rawFile.readyState === 4) {
        if (rawFile.status === 200 || rawFile.status === 0) {
          const allText = rawFile.responseText;
          this.parseTextFile(allText, type);
        }
      }
    };
    rawFile.send(null);
  }

  parseTextFile(text_file_string: string, type: string) {
    const lines = text_file_string.trim().split('\n');
    for (const line of lines) {
      if (type === 'input') {
        const split_array = this.preprocessTextArray(line.trim().split(';'));
        this.chief_complaints[split_array[0]] = split_array[1] ;
      } else if (type === 'output') {
        const split_array = line.trim().split(';');
        this.ct_numbers[split_array[0]] = split_array[1];
      }
    }
  }

  preprocessTextArray(split_array) {
    const new_array = [];
    for (const elem of split_array) {
      new_array.push(elem.trim().toLowerCase());
    }
    return new_array;
  }

  analyzeCT() {
    const first_card_shown = document.getElementById('card_collapse_one').classList.contains('show');
    const second_card_shown = document.getElementById('card_collapse_two').classList.contains('show');
    if (first_card_shown) {
      this.analyzeFromDescription();
    } else if (second_card_shown) {
      this.analyzeFromTable();
    } else {
      this.ct_output_string = 'Please choose one of the options';
    }

    this.alert_show_bool = true;
    window.scrollTo(0, 0);
  }

  analyzeFromDescription() {
    const ct_output_set = new Set<number>();
    const symptom_description = (<HTMLInputElement>document.getElementById('symptom_input_elem')).value;
    const symptom_list = symptom_description.split(',');
    for (const a_symptom of symptom_list) {
      const ct_number = this.chief_complaints[a_symptom.trim().toLowerCase()];
      if (ct_number !== undefined) {
        ct_output_set.add(ct_number);
      }
    }
    this.formulateOutputString(ct_output_set);
  }

  analyzeFromTable() {
    const ct_output_set = new Set<number>();
    for (const key of Object.keys(this.chief_complaints)) {
      if ((<HTMLInputElement>document.getElementById('yes_radio_' + key)).checked) {
        const ct_number = parseInt(this.chief_complaints[key], 10);
        ct_output_set.add(ct_number);
      }
    }
    this.formulateOutputString(ct_output_set);
  }

  formulateOutputString(ct_output_set: Set<number>) {
    this.ct_output_string = '';
    const ct_sorted_array = Array.from(ct_output_set).sort(
      (a, b) => a - b
      );
    if (ct_sorted_array.length === 0 ) {
      this.ct_output_string = 'None of the available CT is recommended';
    } else {
      this.ct_output_array = ct_sorted_array;
    }
  }

}
