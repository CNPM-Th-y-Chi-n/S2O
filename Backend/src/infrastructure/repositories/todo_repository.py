from src.domain.models.itodo_repository import ITodoRepository
from src.domain.models.todo import Todo
from typing import List, Optional
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from src.infrastructure.models.todo_model import TodoModel
from src.infrastructure.databases.factory_database import FactoryDatabase as db_factory

# Import Base để tránh lỗi vòng lặp
from src.infrastructure.databases.base import Base 

load_dotenv()

class TodoRepository(ITodoRepository):
    def __init__(self, session: Session = None):
        self._todos = []
        self._id_counter = 1
        # Lấy session từ Factory nếu không được truyền vào
        if session:
            self.session = session
        else:
            self.session = db_factory.get_database('POSTGREE').session

    def add(self, todo: Todo) -> TodoModel:
        try:
            # Manual mapping from Todo to TodoModel
            todo_model = TodoModel(
                title=todo.title,
                description=todo.description,
                status=todo.status,
                created_at=todo.created_at,
                updated_at=todo.updated_at
            )
            self.session.add(todo_model)
            self.session.commit()
            self.session.refresh(todo_model)
            return todo_model
        except Exception as e:
            self.session.rollback()
            print(f"Error adding todo: {e}")
            raise ValueError('Could not add Todo')
        # Lưu ý: Không nên close session ở đây nếu dùng Dependency Injection (Flask tự quản lý)

    def get_by_id(self, todo_id: int) -> Optional[TodoModel]:
        return self.session.query(TodoModel).filter_by(id=todo_id).first()

    def list(self) -> List[TodoModel]:
        # ✅ SỬA LẠI: Dùng self.session thay vì session (biến global import lỗi)
        self._todos = self.session.query(TodoModel).all()
        return self._todos

    def update(self, todo: TodoModel) -> TodoModel:
        try:
             # Manual mapping
            todo_data = TodoModel(
                id = todo.id,
                title=todo.title,
                description=todo.description,
                status=todo.status,
                created_at=todo.created_at,
                updated_at=todo.updated_at
            )
            self.session.merge(todo_data)
            self.session.commit()
            return todo_data
        except Exception as e:
            self.session.rollback()
            raise ValueError('Todo not found')

    def delete(self, todo_id: int) -> None:
        try:
            todo = self.session.query(TodoModel).filter_by(id=todo_id).first()
            if todo:
                self.session.delete(todo)
                self.session.commit()
            else:
                raise ValueError('Todo not found')
        except Exception as e:
            self.session.rollback()
            raise ValueError('Could not delete Todo')