import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatFunctionComponent } from './chat-function.component';

describe('ChatFunctionComponent', () => {
  let component: ChatFunctionComponent;
  let fixture: ComponentFixture<ChatFunctionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatFunctionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatFunctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
