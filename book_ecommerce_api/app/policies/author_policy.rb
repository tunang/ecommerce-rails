class AuthorPolicy < ApplicationPolicy
  # Người dùng có thể xem danh sách và chi tiết
  def index?
    true
  end

  def show?
    true
  end

  # Chỉ admin được tạo, cập nhật, xoá
  def create?
    user.admin?
  end

  def update?
    user.admin?
  end

  def destroy?
    user.admin?
  end
  class Scope < Scope
    def resolve
      scope.all
    end
  end
end
