class OrderPolicy < ApplicationPolicy
  def index?
    user.present?
  end

  def get_all?
    user.admin?
  end

  def show?
    user_is_owner? || user.admin?
  end

  def create?
    user.present?
  end

  def update?
    user_is_owner? || user.admin?
  end

  def destroy?
    user_is_owner? || user.admin?
  end

  private

  def user_is_owner?
    user.present? && record.user_id == user.id
  end
end
