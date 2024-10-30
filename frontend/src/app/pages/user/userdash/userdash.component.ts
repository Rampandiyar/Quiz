import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import AddashComponent from "../../admin/addash/addash.component";
import { UserquizComponent } from "../../../components/user/userquiz/userquiz.component";
import { HeaderComponent } from "../../../components/admin/header/header.component";
import { UserheadComponent } from "../../../components/user/userhead/userhead.component";
@Component({
  selector: 'app-userdash',
  standalone: true,
  imports: [CommonModule, AddashComponent, UserquizComponent, HeaderComponent, UserheadComponent],
  templateUrl: './userdash.component.html',
  styleUrl: './userdash.component.css'
})
export default class UserdashComponent {

}
