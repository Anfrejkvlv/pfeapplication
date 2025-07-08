import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateObtenuComponent } from './update-obtenu.component';

describe('UpdateObtenuComponent', () => {
  let component: UpdateObtenuComponent;
  let fixture: ComponentFixture<UpdateObtenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateObtenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateObtenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
