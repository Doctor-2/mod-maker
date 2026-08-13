#!/usr/bin/env ruby
require "zlib"
abort "usage: inject_plugin.rb INPUT.rxdata SOURCE.rb OUTPUT.rxdata" unless ARGV.length == 3
plugins = Marshal.load(File.binread(ARGV[0]))
abort "unexpected PluginScripts format" unless plugins.is_a?(Array) && plugins.all? { |p| p.is_a?(Array) && p.length == 3 }
abort "production base must contain TGOM Companion Logger" unless plugins.any? { |p| p[0] == "TGOM Companion Logger" }
abort "manager already present" if plugins.any? { |p| p[0] == "TGOM Manager Mode" }
source = File.binread(ARGV[1])
plugins << ["TGOM Manager Mode", { :name=>"TGOM Manager Mode", :version=>"0.1", :essentials=>["20.1"] }, [["TGOM_Manager_Mode.rb", Zlib::Deflate.deflate(source)]]]
File.binwrite(ARGV[2], Marshal.dump(plugins))
