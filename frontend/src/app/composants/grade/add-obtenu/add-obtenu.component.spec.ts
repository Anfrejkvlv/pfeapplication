import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddObtenuComponent } from './add-obtenu.component';

describe('AddObtenuComponent', () => {
  let component: AddObtenuComponent;
  let fixture: ComponentFixture<AddObtenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddObtenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddObtenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
