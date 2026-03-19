require "test_helper"

class DexcomSyncReadingsTest < ActiveSupport::TestCase
  test "imports dexcom readings and avoids duplicates" do
    user = users(:demo)
    user.create_dexcom_connection!(
      access_token: "token",
      refresh_token: "refresh",
      expires_at: 2.hours.from_now,
      environment: "sandbox"
    )

    fake_client = Object.new
    fake_client.define_singleton_method(:egvs) do |start_time:, end_time:|
      {
        "userId" => "dexcom-user-123",
        "records" => [
          {
            "recordId" => "egv-1",
            "displayTime" => Time.zone.now.iso8601,
            "systemTime" => Time.zone.now.utc.iso8601,
            "value" => 142,
            "trend" => "flat"
          }
        ]
      }
    end
    fake_client.define_singleton_method(:refresh_tokens!) { |_connection| }

    assert_difference(-> { user.glucose_readings.where(source: "dexcom").count }, 1) do
      imported_count = Dexcom::SyncReadings.call(user: user, start_time: 2.hours.ago, end_time: Time.zone.now, client: fake_client)
      assert_equal 1, imported_count
    end

    assert_no_difference(-> { user.glucose_readings.where(source: "dexcom").count }) do
      imported_count = Dexcom::SyncReadings.call(user: user, start_time: 2.hours.ago, end_time: Time.zone.now, client: fake_client)
      assert_equal 0, imported_count
    end

    imported_reading = user.glucose_readings.find_by!(source: "dexcom", external_id: "egv-1")
    assert_equal "cgm", imported_reading.context
    assert_equal "flat", imported_reading.trend
    assert_equal "dexcom-user-123", user.dexcom_connection.reload.external_user_id
  end
end
