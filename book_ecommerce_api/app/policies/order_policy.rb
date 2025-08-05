class OrderPolicy < ApplicationPolicy
  def index?
    user.present?
  end

  def show?
    user_is_owner?
  end

  def create?
    user.present?
  end

  def update?
    user_is_owner?
  end

  def destroy?
    user_is_owner?
  end

  private

  def user_is_owner?
    user.present? && record.user_id == user.id
  end
end
